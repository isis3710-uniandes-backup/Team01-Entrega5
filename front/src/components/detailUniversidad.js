import React, { Component } from 'react'
import {Card, Image} from 'react-bootstrap';
import { Link } from "react-router-dom";
import "../styles/detailUniversidad.css"

export default class universidad extends Component {
    constructor(props) {
        super(props);
        this.state = {

            nombre: this.props.universidad.nombre,
            direccion: this.props.universidad.direccion,
            puestoNacional: this.props.universidad.puestoNacional,
            puestoInternacional: this.props.universidad.puestoInternacional,
            costo : this.props.universidad.costo,
            imagen: this.props.universidad.logo,
            ciudad: this.props.ciudad,
            programa: this.props.programa
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.programa !== this.props.programa)
        {
            this.setState({
                programa : this.props.programa
            })
        }
        if(prevProps.universidad !== this.props.universidad){
            this.setState({
                nombre: this.props.universidad.nombre,
                direccion: this.props.universidad.direccion,
                puestoNacional: this.props.universidad.puestoNacional,
                puestoInternacional: this.props.puestoInternacional,
                imagen: this.props.universidad.logo,
                costo : this.props.universidad.costo
            })
        }
    }
    render() {
        return (
            <div  className="col-12 marginBottom">
                 <Link className="linkuniversidad" to ={{
                    pathname: `/universidad/+${this.state.nombre.toUpperCase()}+/programa/${this.state.programa.toUpperCase()}`}} >
                    <Card className="cUniversidad" >
                            <Card.Body >
                            <h1 className="nombreuniversidad" ><strong>{this.state.nombre}</strong></h1>  
                            <div className="row info" >
                                <div className="col-3" >
                                <br></br>
                                <Image className="LogoUniversidad" aria-label={`Logo ${this.state.nombre}`}src={this.state.imagen}></Image>
                                </div>
                                <div className="col-9 detailUniversidad-info">
                                    <p>Puesto a nivel nacional: {this.state.puestoNacional}</p>
                                    <p>Puesto a nivel internacional: {this.state.puestoInternacional}</p>
                                    <p>{this.state.direccion}</p>
                                    <p>Costo : {this.state.costo}</p>
                                </div>
                            </div>
                                
                        </Card.Body>
                    </Card>
                </Link>    
            </div>
        )
    }
}
