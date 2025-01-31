import React, { Component } from 'react';
import '../styles/home.css';
import { Link } from 'react-router-dom';
import logo from '../assets/imgs/FutureGuide.png';
import Register from './registro';
import LogIn from './logIn';
import homeEs from '../locales/homeEs.json';
import homeEn from '../locales/homeEn.json';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import homeImage from '../assets/imgs/home.jpg';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

export default class home extends Component {
	state = {
		isLoading: false,
		resultsSearched: [],
		programsByArea: [],
		programsBackUp: [],
		valueSearched: '',
		registro: false,
		logIn: false,
		alreadyLogged: false,
		vToken: false,
		messages: {}
	};

	closeRegistro = () => {
		this.setState({ registro: false });
	};

	openRegistro = () => {
		this.setState({ registro: true });
	};

	saveSearch = (e) => {
		document.getElementById('searchButton').classList.add('disabled');
		this.setState(
			{
				valueSearched: e.target.value
			},
			() => {
				let esta = false;
				let programs = this.state.programsByArea;
				for (let index = 0; index < programs.length && !esta; index++) {
					let titles = programs[index].results;
					for (let j = 0; j < titles.length && !esta; j++) {
						const element = titles[j];
						if (element.title === this.state.valueSearched) {
							esta = true;
							document
								.getElementById('searchButton')
								.classList.remove('disabled');
						}
					}
				}
			}
		);
	};
	closeSession = () => {
		Cookies.remove('JSESSIONID');
		this.setState({
			alreadyLogged: false
		});
	};
	closeLogIn = () => {
		let botones = document.getElementsByClassName('initialBtns');
		for (let index = 0; index < botones.length; index++) {
			const element = botones[index];
			element.classList.remove('hidde');
		}
		this.setState({ logIn: false, alreadyLogged: false });
	};
	cierreExitoso = () => {
		// TO DO: Falta revisar PWA.
		this.setState({ logIn: false, alreadyLogged: true }, () => {
			let botones = document.getElementsByClassName('initialBtns');
			for (let index = 0; index < botones.length; index++) {
				const element = botones[index];
				element.classList.remove('hidde');
			}
		});
		let token = Cookies.get('JSESSIONID');
		if (token) {
			fetch('https://futureguide.herokuapp.com/programas/area', {
				method: 'GET',
				headers: new Headers({
					Authorization: token
				})
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.success === false) {
						this.setState({
							alreadyLogged: false
						});
					} else {
						let objectFinal = [];
						json.forEach((element) => {
							objectFinal.push({
								name: element._id,
								results: element.programs
							});
						});
						this.setState({
							programsByArea: objectFinal,
							programsBackUp: objectFinal,
							alreadyLogged: true
						});
						console.log(this.state.programsByArea);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			console.log('Loguese');
		}
	};

	showToken = () => {
		this.setState({
			vToken: !this.state.vToken
		});
	};

	openLogIn = () => {
		this.setState({ logIn: true });
		let botones = document.getElementsByClassName('initialBtns');
		for (let index = 0; index < botones.length; index++) {
			const element = botones[index];
			element.classList.add('hidde');
		}
	};

	componentDidMount() {
		let language = navigator.language || navigator.userLanguage;
		language === 'en'
			? this.setState({ messages: homeEn })
			: this.setState({ messages: homeEs });
		if (this.props.location.state) {
			this.closeSession();
		}
		if (navigator.onLine) {
			let token = Cookies.get('JSESSIONID');

			if (token) {
				this.setState({
					alreadyLogged: true
				});
				fetch('https://futureguide.herokuapp.com/programas/area', {
					method: 'GET',
					headers: new Headers({
						Authorization: token
					})
				})
					.then((res) => res.json())
					.then((json) => {
						if (json.success === false) {
							this.setState(
								{
									alreadyLogged: false
								},
								() => {
									Cookies.remove('JSESSIONID');
								}
							);
						} else {
							let objectFinal = [];
							json.forEach((element) => {
								objectFinal.push({
									name: element._id,
									results: element.programs
								});
							});
							this.setState({
								programsByArea: objectFinal,
								programsBackUp: objectFinal,
								alreadyLogged: true
							});
						}
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				console.log('hh');
			}
		} else {
			console.log('kk');
			this.setState(
				{
					alreadyLogged: true
				},
				() => {
					toast(this.state.messages.noInternet, {
						containerId: 'A',
						position: 'bottom-right',
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true
					});
				}
			);
		}
	}

	render() {
		return (
			<div
				role='main'
				id='homecontainer'
				className='container'
				style={{ backgroundImage: homeImage }}
			>
				<ToastContainer
					containerId={'A'}
					position='bottom-right'
					autoClose={2400}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange
					draggable
					pauseOnHover
				/>
				<nav className='navbar sticky-top navbar-light bg-light'>
					<a className='navbar-brand' href='/' tabIndex='-1'>
						<img
							src={logo}
							height='60'
							className='d-inline-block align-top'
							alt='Futureguide logo'
						/>
					</a>

					{this.state.vToken ? (
						<h1 id='token'>{Cookies.get('JSESSIONID')}</h1>
					) : (
						false
					)}
					{!this.state.alreadyLogged ? (
						<div className='form-inline'>
							<button className='btn initialBtns' onClick={this.openLogIn}>
								<FormattedMessage id='logIn' />
							</button>
							<LogIn
								mostrar={this.state.logIn}
								cierreExitoso={this.cierreExitoso}
								cerrar={this.closeLogIn}
							/>
							<button
								className='btn initialBtns'
								type='submit'
								onClick={this.openRegistro}
							>
								<FormattedMessage id='register' />
							</button>
							<Register
								mostrar={this.state.registro}
								cerrar={this.closeRegistro}
							/>
						</div>
					) : (
						<div className='form-inline'>
							{/*                             <button className="btn initialBtns" onClick={this.showToken}>Token</button>
							 */}{' '}
							<Link to='/carreras'>
								<button className='btn initialBtns'>
									<FormattedMessage id='explore' />
								</button>
							</Link>
							<button className='btn initialBtns' onClick={this.closeSession}>
								<FormattedMessage id='signOut' />
							</button>
						</div>
					)}
				</nav>
				<div
					id='homeContainer'
					className='d-flex justify-content-center align-items-center flex-wrap'
				>
					<h1 id='slogan'>
						<FormattedMessage id='slogan' />
					</h1>
					<form>
						<div className='form-row'>
							<input
								type='text'
								id='searchBar'
								placeholder={this.state.messages.phProgram}
								list='options'
								onChange={this.saveSearch}
								aria-label={this.state.messages.searchBar}
							></input>
							<datalist id='options'>
								{this.state.programsByArea.map((e, i) =>
									e.results.map((element, i) => (
										<option key={i} value={element.title}>
											{e.name}
										</option>
									))
								)}
							</datalist>
							<Link
								className='btn disabled'
								id='searchButton'
								aria-disabled='true'
								tabIndex='-1'
								onClick={this.search}
								to={{
									pathname: `carreras/`,
									state: {}
								}}
							>
								<FormattedMessage id='search' />
							</Link>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
