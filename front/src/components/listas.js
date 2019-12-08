import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import ListProgramas from './listProgramas';
import ListUniversidades from './listUniversidades';
import Cookies from 'js-cookie';
import '../styles/listas.css';
import { Redirect } from 'react-router-dom';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import cap from '../assets/imgs/graduate-cap.png';
import { toast } from 'react-toastify';
import Estadisticas from './estadisticas';
import { FormattedMessage } from 'react-intl';
import localeEnMessages from "../locales/en";
import localeEsMessages from "../locales/es";

export default class Listas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			programas: [],
			programasTotal: [],
			universidadesTotal: [],
			universidades: [],
			nombrePrograma: '',
			programClicked: false,
			costoRange: [0, 25000000],
			estadisticas: false
		};
	}

	componentDidMount() {
		let token = Cookies.get('JSESSIONID');
		if (!navigator.onLine) {
			if (localStorage.getItem('programas') === null) {
				this.setState({
					programas: [],
					programasTotal: []
				});

				toast('No se lograron cargar programas', {
					containerId: 'A',
					position: 'bottom-right',
					autoClose: 2600,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true
				});
			} else {
				let programasAlmacenados = localStorage.getItem('programas');
				this.setState({
					programas: JSON.parse(programasAlmacenados),
					programasTotal: JSON.parse(programasAlmacenados)
				});
			}
		} else {
			if (token) {
				fetch('https://futureguide.herokuapp.com/programas', {
					method: 'GET',
					headers: new Headers({
						Authorization: token
					})
				})
					.then((resp) => resp.json())
					.then((json) => {
						localStorage.setItem('programas', JSON.stringify(json));
						this.setState({
							programas: json,
							programasTotal: json
						});
					});
			}
		}
	}

	closeEstadisticas = () => {
		this.setState({ estadisticas: false });
	};

	openEstadisticas = () => {
		this.setState({ estadisticas: true });
	};

	changePrograms = (e) => {
		this.setState({
			programas: this.state.programasTotal.filter((element) =>
				element.nombre.includes(e.target.value.toUpperCase())
			)
		});
	};
	changeUniversities = (e) => {
		this.setState({
			universidades: this.state.universidadesTotal.filter((element) => {
				return (
					element.nombre.includes(e.target.value.toUpperCase()) ||
					element.nickname.includes(e.target.value.toUpperCase())
				);
			})
		});
	};

	actualizarUniversidades = (pUniversidades, pNombrePrograma) => {
		let token = Cookies.get('JSESSIONID');
		let universidadesNuevas;
		if (!navigator.onLine) {
			if (localStorage.getItem(`universidades${pNombrePrograma}`) === null) {
				toast(
					'No se lograron cargar las universidades, esperamos que pronto tenga internet.',
					{
						containerId: 'A',
						position: 'bottom-right',
						autoClose: 4000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true
					}
				);
			} else {
				let info = localStorage.getItem(`universidades${pNombrePrograma}`);
				this.setState({
					universidades: JSON.parse(info),
					universidadesTotal: JSON.parse(info),
					nombrePrograma: pNombrePrograma,
					programClicked: true
				});
			}
		} else {
			if (token) {
				let urlServer = 'https://futureguide.herokuapp.com';
				fetch(
					urlServer + `/programas/${pNombrePrograma}/universidades/detail`,
					{
						method: 'GET',
						headers: new Headers({
							Authorization: token
						})
					}
				)
					.then((res) => res.json())
					.then((json) => {
						universidadesNuevas = json;
						localStorage.setItem(
							`universidades${pNombrePrograma}`,
							JSON.stringify(json)
						);
						this.setState({
							universidades: universidadesNuevas,
							universidadesTotal: universidadesNuevas,
							nombrePrograma: pNombrePrograma,
							programClicked: true
						});
					});
			}
		}
	};
	changeCosto = (event, newValue) => {
		this.setState({
			costoRange: newValue,
			universidades: this.state.universidadesTotal.filter((element) => {
				if (element.costo !== 'Basado en estrato social') {
					return (
						element.costo <= newValue[1] * 1000000 &&
						element.costo >= newValue[0] * 1000000
					);
				} else {
					return true;
				}
			})
		});
	};

	render() {
		let token = Cookies.get('JSESSIONID');
		if (!token) {
			return <Redirect to='/' />;
		}
		return (
			<Row
				className='container-fluid listas'
				style={{ overflowY: 'auto' }}
				role='main'
			>
				<Col className='col-6'>
					<div className='col-12 searchprogramInput__Container'>
						<input
							className='form-control form-control-sm searchprogramInput'
							type='text'
							placeholder={navigator.language === 'en' ? "Search Program..." : "Buscar Programa..."}
							onChange={this.changePrograms}
							aria-label='Input para buscar un programa'
						></input>
					</div>
					<div className='scrollbar scrollbar-primary' tabIndex='0'>
						<ListProgramas
							funcionUniversidades={this.actualizarUniversidades}
							programas={this.state.programas}
						></ListProgramas>
					</div>
				</Col>

				{this.state.programClicked ? (
					<>
						<Col className='col-6' id='ListaUniversidades'>
							<div className='col-12 ' id='filterBox'>
								<h1 className='text-center' id='filtrosTitle'>
									<FormattedMessage id='filters' />
								</h1>
								<div className='row'>
									<div className='col-md-6 col-xl-6 col-12 '>
										<Typography id='range-slider' gutterBottom>
											<FormattedMessage id='semesterCost' />
										</Typography>
										<Slider
											value={this.state.costoRange}
											onChange={this.changeCosto}
											valueLabelDisplay='auto'
											aria-labelledby='range-slider'
											min={0}
											max={25}
											getAriaValueText={() => {
												return this.state.costoRange;
											}}
											marks={[
												{ value: 0, label: '$0' },
												{ value: 25, label: '$25M' }
											]}
										/>
									</div>
									<div className='col-md-6 col-xl-6 col-12 '>
										<input
											className='form-control form-control-sm searchprogramInput'
											type='text'
											placeholder={navigator.language === 'en' ? "Search University..." : "Buscar Universidad..."}
											onChange={this.changeUniversities}
											aria-label='Input para buscar una universidad'
										></input>
										<button
											className='btn btnStats'
											onClick={this.openEstadisticas}
										>
											<FormattedMessage id='statistics' />
											<i className='fas fa-chart-bar'></i>
										</button>
										<Estadisticas
											mostrar={this.state.estadisticas}
											cerrar={this.closeEstadisticas}
											universidades={this.state.universidades}
										/>
									</div>
								</div>
								<br></br>
							</div>
							<div className='scrollbar scrollbar-universidades'>
								<ListUniversidades
									nombrePrograma={this.state.nombrePrograma}
									universidades={this.state.universidades}
								></ListUniversidades>
							</div>
						</Col>
					</>
				) : (
					<Col
						className='col-6 d-flex align-items-center'
						id='ListaUniversidades'
					>
						<div className='text-center w-100'>
							<img src={cap} alt='Marca de agua.' className='img-fluid' />
						</div>
					</Col>
				)}
			</Row>
		);
	}
}
