using FluentValidation.AspNetCore;
using HealthChecks.UI.Client;
using Product.API.Extensions;
using Product.API.Filters;
using Product.API.Services;
using Product.Application;
using Product.Application.Common.Constants;
using Product.Application.Common.Models;
using Product.Application.Contracts;
using Product.Infrastructure;
using Product.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Sinks.Elasticsearch;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
builder.Configuration.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{environment}.json", optional: true)
    .AddEnvironmentVariables();


// Add services to the container.

Log.Logger = new LoggerConfiguration()
    .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(builder.Configuration["ElasticConfiguration:Uri"]))
    {
        AutoRegisterTemplate = true,
        IndexFormat = $"{Assembly.GetExecutingAssembly().GetName().Name?.ToLower().Replace(".", "-")}-{environment?.ToLower().Replace(".", "-")}-{DateTime.UtcNow:yyyy-MM}"
    })
    .WriteTo.Seq(builder.Configuration["SeqConfiguration:Uri"] == null ? "" : builder.Configuration["SeqConfiguration:Uri"])
    .WriteTo.Console()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.ConfigureEureka(builder.Configuration);
builder.Services.ConfigureMassTransit(builder.Configuration);

builder.Services.AddApplication().AddInfrastructure(builder.Configuration);
builder.Services.AddSingleton<ICurrentUserService, CurrentUserService>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddControllers(options =>
    options.Filters.Add<ApiExceptionFilterAttribute>())
    .AddFluentValidation(x =>
    {
        x.AutomaticValidationEnabled = false;
        x.DisableDataAnnotationsValidation = true;
    });

builder.Services.AddAuthorization(opt =>
{
    foreach (var prop in typeof(PermissionConstants).GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy))
    {
        opt.AddPolicy(prop.GetValue(null).ToString(), policy => policy.RequireClaim("permission", prop.GetValue(null).ToString()));
    }
});



//Enable CORS//Cross site resource sharing
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        b => b.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
    );
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

var identityConfiguration =
    builder.Configuration.GetSection("IdentityServerConfiguration").Get<IdentityServerConfiguration>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddIdentityServerAuthentication(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.Authority = identityConfiguration.Authority;
        options.RequireHttpsMetadata = identityConfiguration.RequireHttpsMetaData;
        options.ApiName = identityConfiguration.ApiName;

        //TODO: This option must be removed from Production. This invoked to by pass SSL Certificate verification
        options.JwtBackChannelHandler = new HttpClientHandler()
        {
            ServerCertificateCustomValidationCallback = delegate { return true; }
        };
    });

// Add swagger service
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = identityConfiguration.ApiDisplayName, Version = "v1" });
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri($"{identityConfiguration.Authority}connect/authorize"),
                TokenUrl = new Uri($"{identityConfiguration.Authority}connect/token"),
                Scopes = new Dictionary<string, string> {
                    {identityConfiguration.ApiName, identityConfiguration.ApiDisplayName},
                    {"openid"," Open Id" },
                    {"profile", "Profile"}
                }
            }
        }
    });
    options.OperationFilter<AuthorizeCheckOperationFilter>();
});
builder.Services.AddApiVersioning(config =>
{
    config.DefaultApiVersion = new ApiVersion(int.Parse(builder.Configuration["Api:Version:Major"]), int.Parse(builder.Configuration["Api:Version:Minor"]));
    config.AssumeDefaultVersionWhenUnspecified = true;
});
builder.Services.AddOpenTelemetryTracing(
    (builderTelemetry) => builderTelemetry
                .AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("Product.API"))
                .AddJaegerExporter(j =>
                {
                    j.AgentHost = builder.Configuration["Jaeger:AgentHost"];
                    j.AgentPort = Convert.ToInt32(builder.Configuration["Jaeger:AgentPort"]);
                })
    );

// Sql server health check

builder.Services.AddHealthChecks()
    .AddDbContextCheck<ProductDbContext>("locationdbcontext");



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

//app.UseHttpsRedirection();
app.UseRouting();
//Must be between app.UseRouting() and app.UseEndPoints()
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Location API v1");
    c.OAuthClientId(identityConfiguration.SwaggerUIClientId);
    c.OAuthAppName(identityConfiguration.ApiName);
    c.OAuthUsePkce();
});

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

// Cofigure for health check
app.MapHealthChecks("/hc", new HealthCheckOptions()
{
    Predicate = _ => true,
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
});

//a basic health probe configuration that reports the app's availability to process requests (liveness) is sufficient to discover the status of the app.
app.MapHealthChecks("/liveness", new HealthCheckOptions()
{
    Predicate = r => r.Name.Contains("self"),
});


app.Run();