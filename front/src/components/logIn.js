import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
import logInEn from '../locales/logInEn.json';
import logInEs from '../locales/logInEs.json';
import { FormattedMessage } from 'react-intl';
const md5 = require('md5');

class LogIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usuario: '',
			password: '',
			placeholderMessages: {},
			show: this.props.mostrar
		};
		this.changeValue = this.changeValue.bind(this);
		this.logIn = this.logIn.bind(this);
		this.hide = this.hide.bind(this);
	}
	componentDidUpdate(prevProps) {
		if (this.props.mostrar !== prevProps.mostrar) {
			this.setState({ show: this.props.mostrar });
		}
	}
	componentDidMount() {
		let language = navigator.language || navigator.userLanguage;
		language === 'en'
			? this.setState({ placeholderMessages: logInEn })
			: this.setState({ placeholderMessages: logInEs });
	}
	logIn() {
		if (this.state.usuario !== '' && this.state.password !== '') {
			var data = {
				_id: this.state.usuario,
				password: md5(this.state.password)
			};
			let urlServer = 'http://futureguide.herokuapp.com';
			// let urlServer = "http://localhost:3001"
			if (navigator.onLine) {
				fetch(urlServer + '/login', {
					method: 'POST',
					body: JSON.stringify(data),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					}
				})
					.then((res) => res.json())
					.then((json) => {
						Cookies.set('JSESSIONID', json.token, { expires: 0.125 });
						Cookies.set('USERNAME', this.state.usuario);
						if (json) {
							toast('¡Bienvenido de nuevo ' + this.state.usuario + ' !', {
								containerId: 'A',
								position: 'bottom-right',
								autoClose: 2000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true
							});
							this.hideSuccess();
						} else {
							toast.error(
								'Usuario o contraseña incorrecta. Vuelva a intentarlo',
								{
									containerId: 'A',
									position: 'top-center',
									autoClose: 1500,
									hideProgressBar: false,
									closeOnClick: true,
									pauseOnHover: true,
									draggable: true
								}
							);
						}
					})
					.catch((error) => {
						toast.error(
							'Usuario o contraseña incorrecta. Vuelva a intentarlo',
							{
								containerId: 'A',
								position: 'top-center',
								autoClose: 1200,
								hideProgressBar: true,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true
							}
						);
					});
			}
		} else {
			toast('Debes llenar todos los campos.', {
				containerId: 'A',
				position: 'top-center',
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true
			});
		}
	}
	hide() {
		this.props.cerrar();
	}
	hideSuccess() {
		this.props.cierreExitoso();
	}
	changeValue(e) {
		if (e.target.id === 'usuario') {
			this.setState({
				usuario: e.target.value
			});
		} else {
			this.setState({
				password: e.target.value
			});
		}
	}
	render() {
		return (
			<div>
				<Modal show={this.state.show} onHide={this.hide}>
					<Modal.Header closeButton>
						<Modal.Title>
							<FormattedMessage id='getIn' />
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group>
								<Form.Label>
									<FormattedMessage id='username' />
								</Form.Label>
								<Form.Control
									id='usuario'
									type='text'
									placeholder={this.state.placeholderMessages.username}
									aria-label='Usuario'
									onChange={this.changeValue}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>
									<FormattedMessage id='password' />
								</Form.Label>
								<Form.Control
									id='password'
									type='password'
									placeholder={this.state.placeholderMessages.password}
									aria-label='Contrasenia'
									onChange={this.changeValue}
								/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={this.hide}>
							<FormattedMessage id='close' />
						</Button>
						<Button id='loguearme' onClick={this.logIn}>
							<FormattedMessage id='logMe' />
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default LogIn;
