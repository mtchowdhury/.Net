using MediatR;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Product.Application.Queries.Product;
using Shared.Commands.Product;

namespace Product.API.Controllers;

[EnableCors("CorsPolicy")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProductController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Get(Guid id)
    {
        var response = await _mediator.Send(new GetProductByIdQuery(id));
        return response==null ? NotFound(): Ok(response) ;
    }
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll([FromQuery] GetAllProductQuery query)
    {
        var data = await _mediator.Send(query);
        return data==null?NotFound() : Ok(data);
    }
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddProduct([FromBody] CreateProductCommand command)
    {
        var response = await _mediator.Send(command);
        return Ok(response);
    }
    [HttpPut]
    public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductCommand command)
    {
        var response = await _mediator.Send(command);
        return Ok(response);
    }
    //[HttpDelete]
    //public async Task<IActionResult> DeleteProduct(Guid id)
    //{
    //    return Ok();
    //}
}
