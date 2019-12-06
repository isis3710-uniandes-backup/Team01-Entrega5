import React, { Component } from 'react';
import { Modal, Button} from 'react-bootstrap';
import * as d3 from 'd3';

export default class estadisticas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            universidades: this.props.universidades
        };
        this.hide = this.hide.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.setState({ show: this.props.mostrar });
        }
        this.drawchart(this.state.universidades);
    }
    drawchart(data){
        
        let width = 450;
        let height = 500;
        let margin = { top:25, left:70, bottom: 150, right: 10};
        let iwidth = width - margin.left - margin.right;
        let iheight = height - margin.top -margin.bottom;
        let svg = d3.select(this.refs.canvas).append("svg");

        svg.attr("width", width);
        svg.attr("height", height);
        let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
        
        g.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top/9))
        .attr("text-anchor", "middle") 
        .style("font-size", "16px") 
        .text("Comparación por puesto a nivel nacional");

        let y = d3.scaleLinear() 
            .domain([0, 12])
            .range([iheight, 0]);

        let x = d3.scaleBand()
        .domain(data.map(d => d.nombre) ) 
        .range([0, iwidth])
        .padding(0.1); 

        const bars = g.selectAll("rect").data(data);

        let bar = bars.enter().append("rect")
        .attr("class", "bar")
        .style("fill", "#007dc6")
        .attr("x", d => x(d.nombre))
        .attr("y", d => y(d.puestoNacional))
        .attr("height", d => iheight - y(d.puestoNacional))
        .attr("width", x.bandwidth())  

        g.append("g")
        .classed("x--axis", true)
        .call(d3.axisBottom(x))
        .attr("transform", `translate(0, ${iheight})`)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        g.append("g")
        .classed("y--axis", true)
        .call(d3.axisLeft(y));
        
        d3.select(this.refs.puesto).on("click", function () {
            svg.selectAll(".y--axis").remove();
            svg.selectAll("text").remove();
            g.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top/9))
                .attr("text-anchor", "middle") 
                .style("font-size", "16px") 
                .text("Comparación por puesto a nivel nacional");
            y = d3.scaleLinear() 
            .domain([0, 12])
            .range([iheight, 0]);
            g.append("g")
            .classed("y--axis", true)
            .call(d3.axisLeft(y));
            bar
            .transition()
                .attr("class", "bar")
                .style("fill", "#007dc6")
                .attr("x", d => x(d.nombre))
                .attr("y", d => y(d.puestoNacional))
                .attr("height", d => iheight - y(d.puestoNacional))
                .attr("width", x.bandwidth()); 
        });

        d3.select(this.refs.salario).on("click", function () {
            svg.selectAll(".y--axis").remove();
            svg.selectAll("text").remove();
            g.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top/9))
                .attr("text-anchor", "middle") 
                .style("font-size", "16px") 
                .text("Comparación por Salario");
            y = d3.scaleLinear() 
            .domain([0, 5000000])
            .range([iheight, 0]);
            g.append("g")
            .classed("y--axis", true)
            .call(d3.axisLeft(y));
            bar
            .transition()
                .attr("class", "bar")
                .style("fill", "#00a0ce")
                .attr("x", d => x(d.nombre))
                .attr("y", d => y(d.salario))
                .attr("height", d => iheight - y(d.salario))
                .attr("width", x.bandwidth()); 
        });

        d3.select(this.refs.costo).on("click", function () {
            svg.selectAll(".y--axis").remove();
            svg.selectAll("text").remove();
            g.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top/9))
                .attr("text-anchor", "middle") 
                .style("font-size", "16px") 
                .text("Comparación por Costo de matrícula");
            y = d3.scaleLinear() 
            .domain([0, 22000000])
            .range([iheight, 0]);
            g.append("g")
            .classed("y--axis", true)
            .call(d3.axisLeft(y));
            bar
            .transition()
                .attr("class", "bar")
                .style("fill", "#007dc6")
                .attr("x", d => x(d.nombre))
                .attr("y", d => y(d.costo))
                .attr("height", d => iheight - y(d.costo))
                .attr("width", x.bandwidth()); 
        });

        d3.select(this.refs.duracion).on("click", function () {
            svg.selectAll(".y--axis").remove();
            svg.selectAll("text").remove();
            g.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top/9))
                .attr("text-anchor", "middle") 
                .style("font-size", "16px") 
                .text("Comparación por Duración");
            y = d3.scaleLinear() 
            .domain([0, 12])
            .range([iheight, 0]);
            g.append("g")
            .classed("y--axis", true)
            .call(d3.axisLeft(y));
            bar
            .transition()
                .attr("class", "bar")
                .style("fill", "#00a0ce")
                .attr("x", d => x(d.nombre))
                .attr("y", d => y(d.duracion))
                .attr("height", d => iheight - y(d.duracion))
                .attr("width", x.bandwidth()); 
        });
    }
    hide() {
        this.props.cerrar();
    }
    render() {
        return (
        <div>
            <Modal id="modalEstadisticas" show={this.state.show} onHide={this.hide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Compara por el criterio que desees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div ref="canvas">
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" ref="costo">Costo</Button>
                        <Button variant="secondary" ref="salario">Salario</Button>
                        <Button variant="secondary" ref="puesto">Puesto a nivel nacional</Button>
                        <Button variant="secondary" ref="duracion">Duración</Button>
                    </Modal.Footer>
            </Modal>
        </div>
        )
    }
}
