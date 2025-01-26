using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserAuthAPI.DTOs;
using UserAuthAPI.Services;

namespace UserAuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO request)
        {
            var result = await _authService.Register(request);
            if (!result.success)
            {
                return BadRequest(result.message);
            }

            return Ok(new { message = result.message, user = result.user });
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDTO request)
        {
            var result = await _authService.Login(request);
            if (!result.success)
            {
                return BadRequest(result.message);
            }

            return Ok(new { message = result.message, token = result.token, user = result.user });
        }

        [Authorize]
        [HttpGet("users")]
        public async Task<ActionResult<List<UserDTO>>> GetUsers()
        {
            var users = await _authService.GetAllUsers();
            return Ok(users);
        }
    }
}
