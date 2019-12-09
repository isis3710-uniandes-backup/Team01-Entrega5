import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as d3 from 'd3';
import { FormattedMessage } from 'react-intl';
import chartTextEn from '../locales/chartTextEn.json';
import chartTextEs from '../locales/chartTextEs.json';
import '../styles/estadisticas.css';

export default class estadisticas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			universidades: this.props.universidades,
			chartText: {}
		};
		this.hide = this.hide.bind(this);
	}
	componentDidUpdate(prevProps) {
		if (this.props.universidades !== prevProps.universidades) {
			this.setState(
				{
					universidades: this.props.universidades,
				}
			);
		}
		this.drawchart(this.state.universidades);
	}
	componentDidMount() {
		let language = navigator.language || navigator.userLanguage;
		language === 'en'
			? this.setState({ chartText: chartTextEn })
			: this.setState({ chartText: chartTextEs });
	}
	drawchart(data) {
		let modalBody = document.getElementById("theBody");
		let width = modalBody !== null ? (modalBody.offsetWidth - 20) : 400;
		let height = modalBody !== null ? (modalBody.offsetHeight - 20) : 450;
		let margin = { top: 25, left: 70, bottom: 150, right: 10 };
		let iwidth = width - margin.left - margin.right;
		let iheight = height - margin.top - margin.bottom;
		let svg = d3.select(this.refs.canvas).append('svg');

		svg.attr('width', width);
		svg.attr('height', height);
		let g = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		g.append('text')
			.attr('x', width / 2)
			.attr('y', 0 - margin.top / 9)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.text('Comparación por puesto a nivel nacional');

		let y = d3
			.scaleLinear()
			.domain([0, 12])
			.range([iheight, 0]);

		let x = d3
			.scaleBand()
			.domain(data.map((d) => d.nombre))
			.range([0, iwidth])
			.padding(0.1);

		const bars = g.selectAll('rect').data(data);

		let bar = bars
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.style('fill', '#007dc6')
			.attr('x', (d) => x(d.nombre))
			.attr('y', (d) => y(d.puestoNacional))
			.attr('height', (d) => iheight - y(d.puestoNacional))
			.attr('width', x.bandwidth());

		g.append('g')
			.classed('x--axis', true)
			.call(d3.axisBottom(x))
			.attr('transform', `translate(0, ${iheight})`)
			.selectAll('text')
			.attr('transform', 'translate(-10,0)rotate(-45)')
			.style('text-anchor', 'end');

		g.append('g')
			.classed('y--axis', true)
			.call(d3.axisLeft(y));

		d3.select(this.refs.puesto).on('click', function () {
			svg.selectAll('.y--axis').remove();
			svg.selectAll('text').remove();
			g.append('text')
				.attr('x', width / 2)
				.attr('y', 0 - margin.top / 9)
				.attr('text-anchor', 'middle')
				.style('font-size', '16px')
				.text('Comparación por puesto a nivel nacional');
			y = d3
				.scaleLinear()
				.domain([0, 12])
				.range([iheight, 0]);
			g.append('g')
				.classed('y--axis', true)
				.call(d3.axisLeft(y));
			g.append('g')
				.classed('x--axis', true)
				.call(d3.axisBottom(x))
				.attr('transform', `translate(0, ${iheight})`)
				.selectAll('text')
				.attr('transform', 'translate(-10,0)rotate(-45)')
				.style('text-anchor', 'end');
			bar
				.transition()
				.attr('class', 'bar')
				.style('fill', '#007dc6')
				.attr('x', (d) => x(d.nombre))
				.attr('y', (d) => y(d.puestoNacional))
				.attr('height', (d) => iheight - y(d.puestoNacional))
				.attr('width', x.bandwidth())
				.duration(1500);
		});

		d3.select(this.refs.salario).on('click', function () {
			svg.selectAll('.y--axis').remove();
			svg.selectAll('text').remove();
			g.append('text')
				.attr('x', width / 2)
				.attr('y', 0 - margin.top / 9)
				.attr('text-anchor', 'middle')
				.style('font-size', '16px')
				.text('Comparación por Salario');
			y = d3
				.scaleLinear()
				.domain([0, 5000000])
				.range([iheight, 0]);
			g.append('g')
				.classed('y--axis', true)
				.call(d3.axisLeft(y));
			g.append('g')
				.classed('x--axis', true)
				.call(d3.axisBottom(x))
				.attr('transform', `translate(0, ${iheight})`)
				.selectAll('text')
				.attr('transform', 'translate(-10,0)rotate(-45)')
				.style('text-anchor', 'end');
			bar
				.transition()
				.attr('class', 'bar')
				.style('fill', '#00a0ce')
				.attr('x', (d) => x(d.nombre))
				.attr('y', (d) => y(d.salario))
				.attr('height', (d) => iheight - y(d.salario))
				.attr('width', x.bandwidth())
				.duration(1500);
		});

		d3.select(this.refs.costo).on('click', function () {
			svg.selectAll('.y--axis').remove();
			svg.selectAll('text').remove();
			g.append('text')
				.attr('x', width / 2)
				.attr('y', 0 - margin.top / 9)
				.attr('text-anchor', 'middle')
				.style('font-size', '16px')
				.text('Comparación por Costo de matrícula');
			y = d3
				.scaleLinear()
				.domain([0, 22000000])
				.range([iheight, 0]);
			g.append('g')
				.classed('y--axis', true)
				.call(d3.axisLeft(y));
			g.append('g')
				.classed('x--axis', true)
				.call(d3.axisBottom(x))
				.attr('transform', `translate(0, ${iheight})`)
				.selectAll('text')
				.attr('transform', 'translate(-10,0)rotate(-45)')
				.style('text-anchor', 'end');
			bar
				.transition()
				.attr('class', 'bar')
				.style('fill', '#007dc6')
				.attr('x', (d) => x(d.nombre))
				.attr('y', (d) => y(d.costo))
				.attr('height', function (d) {
					if (d.costo !== "Basado en estrato social") {
						return iheight - y(d.costo)
					}
					else {
						return 0
					}
				})
				.attr('width', x.bandwidth())
				.duration(1500);
		});

		d3.select(this.refs.duracion).on('click', function () {
			svg.selectAll('.y--axis').remove();
			svg.selectAll('text').remove();
			g.append('text')
				.attr('x', width / 2)
				.attr('y', 0 - margin.top / 9)
				.attr('text-anchor', 'middle')
				.style('font-size', '16px')
				.text('Comparación por Duración');
			y = d3
				.scaleLinear()
				.domain([0, 12])
				.range([iheight, 0]);
			g.append('g')
				.classed('y--axis', true)
				.call(d3.axisLeft(y));
			g.append('g')
				.classed('x--axis', true)
				.call(d3.axisBottom(x))
				.attr('transform', `translate(0, ${iheight})`)
				.selectAll('text')
				.attr('transform', 'translate(-10,0)rotate(-45)')
				.style('text-anchor', 'end');
			bar
				.transition()
				.attr('class', 'bar')
				.style('fill', '#00a0ce')
				.attr('x', (d) => { console.log(d.nombre); x(d.nombre) })
				.attr('y', (d) => y(d.duracion))
				.attr('height', (d) => iheight - y(d.duracion))
				.attr('width', x.bandwidth())
				.duration(1500);
		});
	}
	hide() {
		this.props.cerrar();
	}

	render() {
		return (
			<div>
				<Modal
					id='modalEstadisticas'
					show={this.props.mostrar}
					onHide={this.hide}
				>
					<Modal.Header className="text-center" closeButton>
						<Modal.Title id="modaltitle">
							<FormattedMessage id='criteria' />
						</Modal.Title>
					</Modal.Header>
					<Modal.Body id="theBody">
						<div id="footerModal">
							<Button className="btn-modal" variant='secondary' ref='costo'>
								<FormattedMessage id='cost' />
							</Button>
							<Button className="btn-modal" variant='secondary' ref='salario'>
								<FormattedMessage id='salary' />
							</Button>
							<Button className="btn-modal" variant='secondary' ref='puesto'>
								<FormattedMessage id='nationalRanking' />
							</Button>
							<Button className="btn-modal" variant='secondary' ref='duracion'>
								<FormattedMessage id='duration' />
							</Button>
						</div>
						<div id="graficas" ref='canvas'></div>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}
