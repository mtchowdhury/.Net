#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["src/Product.API/Product.API.csproj", "src/Product.API/"]
COPY ["src/Product.Application/Product.Application.csproj", "src/Product.Application/"]
COPY ["src/Product.Core/Product.Core.csproj", "src/Product.Core/"]
COPY ["src/Shared/Shared.csproj", "src/Shared/"]
COPY ["src/Product.Infrastructure/Product.Infrastructure.csproj", "src/Product.Infrastructure/"]
RUN dotnet restore "src/Product.API/Product.API.csproj"
COPY . .
WORKDIR "/src/src/Product.API"
RUN dotnet build "Product.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Product.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Product.API.dll"]