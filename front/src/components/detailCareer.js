import React, { Component } from 'react'
import {
    Redirect
} from "react-router-dom";
import Cookies from 'js-cookie'
import timeImage from "../assets/imgs/alarm-clock.png"
import cashImage from "../assets/imgs/cash.png"
import acreditacionInternacionalImg from "../assets/imgs/global-marketing.png"
import "../styles/detailCareer.css";
import Swal from "sweetalert2";
import * as d3 from 'd3';
import { FormattedMessage } from 'react-intl';

const formatter = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2
})
export default class detailCareer extends Component {
    state = {
        universidad: "",
        programa: "",
        costo: 0,
        duracion: -1,
        altaCalidad: false,
        acreditacionInternacional: "",
        salario: 0,
        videos: [],
        comentarios: [],
        comentariosPie : [0,0]
    }

    componentDidMount() 
    {
        let { nombre, name } = this.props.match.params;
        nombre = nombre.replace("+", "");
        nombre = nombre.replace("+", "");
        if (!navigator.onLine) {
            if (localStorage.getItem(`u${nombre}p${name}`) === null) 
            {
                this.setState({
                    universidad: "NaN",
                    programa: "Nan",
                    costo: 0,
                    duracion: 0,
                    altaCalidad: false,
                    acreditacionInternacional: "NaN",
                    salario: 0,
                    videos: [],
                    comentarios: []
                });
            }
            else {
                let info = JSON.parse(localStorage.getItem(`u${nombre}p${name}`));
                this.setState({
                    universidad: nombre,
                    programa: name,
                    costo: info.costo,
                    duracion: info.duracion,
                    altaCalidad: info.altaCalidad,
                    acreditacionInternacional: info.acreditacionInternacional,
                    salario: info.salario,
                    videos: info.videos,
                    comentarios: info.comentarios
                }, () => this.graficaReseñas())
            }
        }
        else {
            let token = Cookies.get("JSESSIONID");
            if (token) {

                fetch(`https://futureguide.herokuapp.com/carrera/${nombre.toUpperCase()}/${name.toUpperCase()}`, {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': token
                    })
                }
                )
                    .then(res => res.json())
                    .then(json => {
                        localStorage.setItem(`u${nombre}p${name}`, JSON.stringify(json));
                        json.comentarios.forEach((element, id) => {
                            let dataPIE = this.state.comentariosPie;
                            console.log(element.recomendada);
                           if(element.recomendada === 'false' ||element.recomendada === false )
                           {
                                dataPIE[1]++;
                               this.setState({
                                   comentariosPie : dataPIE
                               });
                           }
                           else
                           {
                            dataPIE[0]++;
                            this.setState({
                                comentariosPie : dataPIE
                            });
                           }
                        });
                        this.setState({
                            universidad: nombre,
                            programa: name,
                            costo: json.costo,
                            duracion: json.duracion,
                            altaCalidad: json.altaCalidad,
                            acreditacionInternacional: json.acreditacionInternacional,
                            salario: json.salario,
                            videos: json.videos,
                            comentarios: json.comentarios,
                            onLine: true
                        }, () => this.graficaReseñas())
                    })
            }
        }
    }

    reseña = () => {
        let token = Cookies.get("JSESSIONID");
        if (token) {
            let botones = document.getElementsByClassName("btnNewComment");
            let boton = botones[0];
            boton.classList.add("hidde");

            Swal.mixin({
                input: 'text',
                confirmButtonText: 'Siguiente &rarr;',
                showCancelButton: true,
                confirmButtonColor: '#024972',
                cancelButtonColor: '#464655',
                cancelButtonText: 'Cancelar',
                background: '#fff',
                progressSteps: ['1', '2', '3']
            }).queue([
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
                    inputPlaceholder:
                        'Seleccione si es así',
                    confirmButtonText: 'Publicar'
                }
            ]).then((result) => {
                if (result.value) {
                    Swal.fire({
                        type: 'success',
                        title: 'Publicado Exitosamente',
                        toast: true,
                        showConfirmButton: false,
                        timer: 2000
                    }).then(e => {
                        let botones = document.getElementsByClassName("btnNewComment");
                        let boton = botones[0];
                        boton.classList.remove("hidde");
                    });
                    let commentsPie = this.state.comentariosPie;
                    let recommended = true;
                    if(result.value[2] === 0)
                    {
                        recommended = false;
                        commentsPie[1]++;
                    }
                    else
                    {
                        commentsPie[0]++;
                    }
                    let json = {
                        titulo: result.value[0],
                        descripcion: result.value[1],
                        recomendada: recommended 
                    };

                    let boddy = JSON.stringify(json);
                    fetch(`https://futureguide.herokuapp.com/carrera/${this.state.universidad.toUpperCase()}/${this.state.programa.toUpperCase()}/${"comentarios"}`, {
                        method: 'POST',
                        headers: new Headers({
                            'Authorization': token,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }),
                        body: boddy
                    }).then(() => {
                        fetch(`https://futureguide.herokuapp.com/usuarios/${Cookies.get("USERNAME")}/${"comentarios"}`, {
                            method: 'POST',
                            headers: new Headers({
                                'Authorization': token,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }),
                            body: boddy
                        }).then(() => {
                            let coments = this.state.comentarios;
                            
                            coments.push(json)
                            this.setState({
                                comentarios: coments,
                                comentariosPie : commentsPie
                            })
                        });
                    })
                }
                let botones = document.getElementsByClassName("btnNewComment");
                let boton = botones[0];
                boton.classList.remove("hidde");
            })
        }
    }
    actualizarGraficoReseñas = () => {
        d3.selectAll("arc")
        .data(this.state.comentariosPie)
        .transition().duration(1000)

    }
    graficaReseñas = () => {
        const width = 120;
        const height = 200;

        const canvas = d3.select(this.refs.aceptacionCanvas);
        const svg = canvas.append("svg");
        svg.attr("width", width);
        svg.attr("height", height);
        let radius = Math.min(width, height) / 2;

        let g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



        var data = this.state.comentariosPie;


        var color = d3.scaleOrdinal(['#005383', '#464655']);

        // Generate the pie
        var pie = d3.pie();

        // Generate the arcs
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var label = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 70);

        //Generate groups
        var arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc")
        

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                console.log(d.value);
                return color(i);
            })
            .attr("d", arc);

        let comentarios = this.state.comentarios.length;
        arcs.append("text")
            .attr("transform", function(d) { 
                     return "translate(" + label.centroid(d) + ")"; 
             })
            .text(function(d, index) {  if(d.value > 0){return `${((d.value/comentarios)*100).toFixed(2)}%`}else{return ""} })
            .attr("font-size", "8px")
            .attr("fill", "white")

    }
    render() {
        let token = Cookies.get("JSESSIONID");
        if (!token) {
            return <Redirect to='/' />
        }
        return (
            <div className="container-fluid detailCareer" role="main">
                <div className="row">
                    <div className="col-lg-7 col-xl-7 col-md-7 col-12 infoDetail">
                        <div className="row">
                            <div className="col-lg-6 col-xl-6 col-md-6 col-12">
                                <h1 id="programName">{this.state.programa}</h1>
                                <h2 id="universityyName">{this.state.universidad}</h2>
                                {this.state.altaCalidad ? <span className="badge badge-calite"><FormattedMessage id='highQuality' /></span> : false}
                                <br />
                                <strong><FormattedMessage id='semesterCost' />: </strong>
                                <strong className="atributosCareer">{typeof this.state.costo === 'number' ? formatter.format(this.state.costo) : this.state.costo}</strong>

                            </div>
                            <ul className="col-lg-6 col-xl-6 col-md-6 col-12x   list-group list-group-flush">
                                <li className="list-group-item  d-flex justify-content-between align-items-center">
                                    <img src={timeImage} className="img-fluid img-responsive img-Little" alt="Duracion de la carrera" />
                                    <strong className="atributosCareer">{this.state.duracion} </strong> <strong className=" cursiveAnotation text-right"><FormattedMessage id='semesters' /></strong>
                                </li>
                                <li className="list-group-item  d-flex justify-content-between align-items-center" data-toggle="tooltip" data-placement="bottom" data-html="true" title="Salario <em>promedio</em>">
                                    <img src={cashImage} className="img-fluid img-responsive img-Little" alt="Duracion de la carrera" />
                                    <p className="atributosCareer">{
                                        formatter.format(this.state.salario)
                                    }</p> <strong className=" cursiveAnotation text-right"><FormattedMessage id='inAverage' /></strong>
                                </li>
                                {this.state.acreditacionInternacional ? <li className="list-group-item  d-flex justify-content-between align-items-center">
                                    <img src={acreditacionInternacionalImg} className="img-fluid img-responsive img-Little" alt="Duracion de la carrera" />
                                    <p className="atributosCareer" id="acreditacionInt">{this.state.acreditacionInternacional}</p>
                                </li> : false}
                            </ul>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-3" id="piechartCol" ref="aceptacionCanvas">
                            </div>
                            <div className="col-9 overflow">
                                <div className="row justify-content-center" id="marginBottomRow">
                                    {this.state.comentarios.length > 1 ? <>
                                        <a className="carousel-control-prev" href="#carousel-example-1z" role="button" data-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="sr-only"><FormattedMessage id='previous' /></span>
                                        </a>
                                        <a className="carousel-control-next" href="#carousel-example-1z" role="button" data-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="sr-only"><FormattedMessage id='next' /></span>
                                        </a>
                                    </> : false}
                                </div>
                                <div id="carousel-example-1z" className="carousel slide carousel-fade" data-ride="carousel">
                                    <ol className="carousel-indicators">
                                        <li data-target="#carousel-example-1z" data-slide-to={0} className="active"></li>
                                        {this.state.comentarios.map((element, index) => index !== 0 ?
                                            <li key={index} data-target="#carousel-example-1z" data-slide-to={index + 1}></li> : false)}
                                    </ol>
                                    <div className="carousel-inner" role="listbox" aria-label="carousel de reseñas">
                                        {this.state.comentarios.length > 0 ?
                                            <div className="carousel-item active" aria-selected="true" role="option">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h3 className="tituloComentario">{this.state.comentarios[0].titulo}</h3>
                                                    </div>
                                                    <div className="card-body">
                                                        <blockquote className="blockquote mb-0">
                                                            <p className="comentarioDescripcion">"{this.state.comentarios[0].descripcion}"</p>
                                                            {(this.state.comentarios[0].recomendada || this.state.comentarios[0].recomendada === 'true') ? <span className="badge badge-style badge-recomendada"><FormattedMessage id='recommended' /></span> : <span className="badge badge-style badge-nrecomendada"><FormattedMessage id='notRecommended' /></span>}
                                                        </blockquote>
                                                    </div>
                                                </div>
                                            </div> : false}
                                        {this.state.comentarios.map((el, i) => <div key={i} className="carousel-item">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h3 className="tituloComentario">{el.titulo}</h3>
                                                </div>
                                                <div className="card-body">
                                                    <blockquote className="blockquote mb-0">
                                                        <p className="comentarioDescripcion">"{el.descripcion}"</p>
                                                        {(el.recomendada || el.recomendada === 'true') ? <span className="badge badge-style badge-recomendada"><FormattedMessage id='recommended' /></span> : <span className="badge badge-style badge-nrecomendada"><FormattedMessage id='notRecommended' /></span>}
                                                    </blockquote>
                                                </div>
                                            </div>
                                        </div>)}
                                    </div>
                                </div>
                                <div className="row boton">
                            <div className="col-12 text-center">
                            {this.state.onLine ? <button type="button" className="btn btnNewComment" onClick={this.reseña}><FormattedMessage id='newComment' /></button> :
                                    <button type="button" className="btn btnNewComment" data-toggle="tooltip" data-placement="bottom" data-html="true" title=" <em>No puedes crear reseñas sin internet</em>" disabled><FormattedMessage id='newComment' /></button>}
                            </div>
                        </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-5 d-none d-md-block text-center" id="videosColumn">
                        <h2><FormattedMessage id='videos' /></h2>
                        <div className="scrollbar scrollbar-videos" tabIndex="0">
                            {this.state.videos.map((element, index) =>
                                <div key={index} className="embed-responsive embed-responsive-16by9 videos">
                                    <iframe className="embed-responsive-item" src={element} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title={`Video${index}`} aria-label={`Video${index}`} allowFullScreen></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
