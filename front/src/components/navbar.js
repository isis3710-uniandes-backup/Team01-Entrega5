import React, { Component } from 'react';
import '../styles/navbar.css';
import LogIn from './logIn';
import Cookies from 'js-cookie';
import { Link, Redirect } from 'react-router-dom';
import LogoCompleto from '../assets/imgs/LogoCompleto.png';
import Register from './registro';
import { FormattedMessage } from 'react-intl';
const Swal = require('sweetalert2');

export default class navbar extends Component {
	state = {
		logIn: false,
		alredyLogged: false,
		internet: false,
		universidades: []
	};

	reseña() {
		Swal.mixin({
			input: 'text',
			confirmButtonText: 'Siguiente &rarr;',
			showCancelButton: true,
			confirmButtonColor: '#00c0be',
			cancelButtonColor: '#464655',
			cancelButtonText: 'Cancelar',
			background: '#fff',
			progressSteps: ['1', '2', '3']
		})
			.queue([
				{
					title: 'Titulo',
					input: 'text',
					inputPlaceholder: 'Escribe el titulo de la reseña...',
					inputAttributes: {
						'aria-label': 'Type your message here'
					}
				},
				{
					title: 'Reseña',
					input: 'textarea',
					inputPlaceholder: 'Escribe tu reseña aquí...',
					inputAttributes: {
						'aria-label': 'Type your message here'
					}
				},
				{
					title: 'La Recomienda?',
					input: 'checkbox',
					inputValue: 0,
					inputPlaceholder: 'Seleccione si es así',
					confirmButtonText: 'Publicar'
				}
			])
			.then((result) => {
				if (result.value) {
					Swal.fire({
						type: 'success',
						title: 'Publicado Exitosamente',
						toast: true,
						showConfirmButton: false,
						timer: 2000
					});
					/*let titulo = result.value[0]
                let descripcion = result.value[1]
                let recomendada = result.value[2]*/
				}
			});
	}
	componentDidMount() {
		if (navigator.onLine) {
			let token = Cookies.get('JSESSIONID');
			if (token) {
				this.setState({
					alredyLogged: true,
					internet: true
				});
			}
		} else {
			this.setState({
				alredyLogged: true,
				internet: false
			});
		}
	}

	closeLogIn = () => {
		this.setState({ logIn: false });
	};

	openLogIn = () => {
		this.setState({ logIn: true });
	};

	closeRegistro = () => {
		this.setState({ registro: false });
	};

	openRegistro = () => {
		this.setState({ registro: true });
	};

	render() {
		let token = Cookies.get('JSESSIONID');
		if (!token) {
			return <Redirect to='/' />;
		}

		return (
			<div>
				<nav className='menu d-none d-md-block'>
					<Link to='/'>
						<div className='logo'>
							<img src={LogoCompleto} alt='Logo de FutureGuide'></img>
						</div>
					</Link>
					<div className='menu_section section_1'>
						<h1 className='onlyForAxe'>
							<FormattedMessage id='navigation' />
						</h1>
					</div>
					<div className='menu__wrap_1'>
						<div data-menu='main' className='menu__level'>
							<Link to='/'>
								<div className='menu__item'>
									<div className='menu__link'>
										<i className='fas fa-home'></i>
										<FormattedMessage id='home' />
									</div>
								</div>
							</Link>
							<Link to='/carreras'>
								<div className='menu__item'>
									<div className='menu__link'>
										<i className='fas fa-graduation-cap'></i>
										<FormattedMessage id='careers' />
									</div>
								</div>
							</Link>
						</div>
					</div>

					<div className='menu_section section_2'>
						<h1 className='onlyForAxe'>
							<FormattedMessage id='configuration' />
						</h1>
					</div>
					<div className='menu__wrap_2'>
						<ul data-menu='main' className='menu__level'>
							<li className='menu__item'>
								<Link to='/perfil' className='menu__link' aria-label='Perfil'>
									<i className='fas fa-user-tie'></i>
									<FormattedMessage id='profile' />
								</Link>
							</li>
							{!this.state.alredyLogged ? (
								<>
									<li className='menu__item'>
										<div className='menu__link' onClick={this.openLogIn}>
											<i className='fas fa-sign-in-alt'></i>
											<FormattedMessage id='logIn' />
											<LogIn
												mostrar={this.state.logIn}
												cerrar={this.closeLogIn}
											/>
										</div>
									</li>
									<li className='menu_movil__item'>
										<div className='menu__link' onClick={this.openRegistro}>
											<i className='fas fa-sign-in-alt' />
											<FormattedMessage id='register' />
											<Register
												mostrar={this.state.registro}
												cerrar={this.closeRegistro}
											/>
										</div>
									</li>
								</>
							) : (
								<li className='menu_movil__item'>
									<Link
										className='menu__link'
										to={{
											pathname: '/',
											state: true
										}}
									>
										<i className='fas fa-sign-out-alt'></i>
										<FormattedMessage id='signOut' />
									</Link>
								</li>
							)}
						</ul>
					</div>
				</nav>

				<nav
					id='menu_movil'
					className='menu_movil d-block d-sm-block d-md-none'
				>
					<div className='row'>
						<div className='col-6 d-none d-sm-block col_izq'>
							<div className='row'>
								<div className='col-6'>
									<Link to='/carreras'>
										<div className='menu_movil__item'>
											<div className='menu_movil__link carreras'>
												<i className='fas fa-graduation-cap'></i>
												<FormattedMessage id='careers' />
											</div>
										</div>
									</Link>
								</div>
								<div className='col-6'>
									<Link to='/'>
										<div className='menu_movil__item'>
											<div className='menu_movil__link carreras'>
												<i className='fas fa-home'></i>
												<FormattedMessage id='home' />
											</div>
										</div>
									</Link>
								</div>
							</div>
						</div>
						<div className='col-6 d-none d-sm-block col_der'>
							<div className='row'>
								<div className='col-6'>
									{!this.state.alredyLogged ? (
										<div className='menu_movil__item'>
											<div
												className='menu_movil__link carreras'
												onClick={this.openLogIn}
											>
												<i className='fas fa-sign-in-alt'></i>
												<FormattedMessage id='logIn' />
												<LogIn
													mostrar={this.state.logIn}
													cerrar={this.closeLogIn}
												/>
											</div>
										</div>
									) : (
										<Link to='/perfil'>
											{' '}
											<div className='menu_movil__item'>
												<div
													className='menu_movil__link carreras'
													aria-label='Perfil'
												>
													<i className='fas fa-user-tie'></i>
													<FormattedMessage id='profile' />
												</div>
											</div>
										</Link>
									)}
								</div>
								<div className='col-6'>
									<div className='menu_movil__item'>
										<Link
											className='menu_movil__link carreras'
											to={{
												pathname: '/',
												state: true
											}}
										>
											<i className='fas fa-sign-out-alt'></i>
											<FormattedMessage id='signOut' />
										</Link>
									</div>
								</div>
							</div>
						</div>

						<div className='col-6 d-block d-sm-none col_izq'>
							<div className='row'>
								<div className='col-6 text-center'>
									<Link
										aria-label='Vamos a ver los programas...'
										to='/carreras'
									>
										<div className='menu_movil__item text-center'>
											<div className='menu_movil__link'>
												<i className='fas fa-graduation-cap'></i>
											</div>
										</div>
									</Link>
								</div>
								<div className='col-6'>
									<Link aria-label='Home button' to='/'>
										<div className='menu_movil__item text-center'>
											<div className='menu_movil__link'>
												<i className='fas fa-home'></i>
											</div>
										</div>
									</Link>
								</div>
							</div>
						</div>
						<div className='col-6 d-block d-sm-none col_der'>
							<div className='row'>
								{!this.state.alredyLogged ? (
									<div className='col-6'>
										<div className='menu_movil__item text-center'>
											<div
												className='menu_movil__link'
												onClick={this.openLogIn}
											>
												<i className='fas fa-sign-in-alt'></i>
											</div>
										</div>
										<LogIn
											mostrar={this.state.logIn}
											cerrar={this.closeLogIn}
										/>
									</div>
								) : (
									<div className='col-6'>
										<div className='menu_movil__item text-center'>
											<Link
												to='/perfil/'
												className='menu_movil__link'
												aria-label='Perfil'
											>
												<i className='fas fa-user-tie'></i>
											</Link>
										</div>
									</div>
								)}
								<div className='col-6'>
									<Link
										aria-label='Salirse'
										className='menu_movil__item text-center'
										to={{
											pathname: '/',
											state: true
										}}
									>
										<div className='menu_movil__link'>
											<i className='fas fa-sign-out-alt'></i>
										</div>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}
