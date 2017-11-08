Vue.component('menus',{
	template: `<nav class="navbar navbar-light bg-light">
  		<div class="col-md-2"><img style="text-align: center;" src="img/connected.png" width="80%" alt="connected B2B" /></div>
  		<div class="col-md-6"><input type="text" placeholder="Busqueda" class="form-control" width="80%" /></div>
  		<div class="col-md-4"><input type="button" class="btn btn-outline-primary al-ri" value="Registro" /><input type="button" class="btn btn-outline-success al-le" value="Iniciar de Sesión" /></div>
	</nav>`
});
Vue.component('publicidad',{
	template:`<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img class="d-block w-100" src="img/slider/slider1.jpg" alt="First slide">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="img/slider/slider2.jpg" alt="Second slide">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="img/slider/slider3.jpg" alt="Third slide">
    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>`
});
Vue.component('producto',{
	template:`<div><h1>Productos</h1>
		<div class="card-group">
		  <div class="card">
		    <img class="card-img-top" src="img/productos/p1.jpg" alt="Card image cap">
		    <div class="card-body">
		      <h4 class="card-title">Card title</h4>
		      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
		      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
		    </div>
		  </div>
		  <div class="card">
		    <img class="card-img-top" src="img/productos/p1.jpg" alt="Card image cap">
		    <div class="card-body">
		      <h4 class="card-title">Card title</h4>
		      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
		      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
		    </div>
		  </div>
		  <div class="card">
		    <img class="card-img-top" src="img/productos/p1.jpg" alt="Card image cap">
		    <div class="card-body">
		      <h4 class="card-title">Card title</h4>
		      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
		      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
		    </div>
		  </div>
		</div>
	</div>`
});
Vue.component('pie',{
	template:`  <!-- Footer -->
  <footer class="footer">
    <div class="container text-center">
      <div class="row">
        <div class="col-md-4 footer-contact-details">
          <h4><i class="fa fa-phone"></i> Llámanos</h4>
          <p><a href="tel:+522225987145">222-598-7145</a></p>
        </div>
        <div class="col-md-4 footer-contact-details">
          <ul class="list-inline">
            <li class="list-inline-item">
              <a href="https://www.facebook.com/Connectedb2b" target="_blank"><i class="fa fa-facebook fa-fw fa-2x"></i></a>
            </li>
            <li class="list-inline-item">
              <a href="https://www.linkedin.com/company/16171728" target="_blank"><i class="fa fa-linkedin fa-fw fa-2x"></i></a>
            </li>
            <li class="list-inline-item">
              <a href="https://www.instagram.com/connectedb2b" target="_blank"><i class="fa fa-instagram fa-fw fa-2x"></i></a>
            </li>
          </ul>
        </div>
        <div class="col-md-4 footer-contact-details">
          <h4><i class="fa fa-envelope"></i> Email</h4>
          <p><a href="mailto:connected@connected2b.com">connected@connected2b.com</a>
          </p>
        </div>
      </div>
      <p class="copyright">&copy; 2017 Connectedb2b</p>
    </div>
  </footer>`
});
var b2b = new Vue 
({
	el: '#connected',
	data:
	{
		mensaje: 'Prueba Vue Hola Mundo'
	}
});