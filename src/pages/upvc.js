import React from "react";
import Navbar from "./navbar";
import Header from "./header";
import Cd from '../images/casement-door.png';
import Cw from '../images/casement-window.png';
import Sd from '../images/sliding-door.png';
import Sw from '../images/sliding-window.png';
import Vent from '../images/ventilator.png';
import fixedW from '../images/fixed-window.png';
import TopHung from '../images/topHung.png';
const App = () => {

    return (
      <div>
        <Navbar />
      
           
       
    <div class="pc-container">
      <div class="pc-content">

        <div class="page-header">
          <div class="page-block">
            <div class="row align-items-center">
              <div class="col-md-12">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><a href="/">Home</a></li>
                  <li class="breadcrumb-item"><a href="/create-quotation">Create Quotes</a></li>
                  <li class="breadcrumb-item" aria-current="page">Select UPVC</li>
                </ul>
              </div>
              <div class="col-md-12 ">
                <div class="page-header-title">
                  <h2 class="mb-0">Select UPVC Product</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
       

       
        <div class="row">
         
          
          <div class="col-sm-3 col-6">
          <a href="/casement-window">
            <div class="card">
              <div class="card-header">
                <h5>Casement Window</h5>
              </div>
              <div class="card-body">
               <img src={Cw} width="100%" />
              </div>
            </div>
            </a>
          </div>

          <div class="col-sm-3 col-6">
          <a href="/casement-door">
            <div class="card">
              <div class="card-header">
                <h5>Casement Door</h5>
              </div>
              <div class="card-body">
              <img src={Cd} width="100%" />
              </div>
            </div>
            </a>
          </div>
          

          <div class="col-sm-3 col-6">
          <a href="/sliding-window">
            <div class="card">
              <div class="card-header">
                <h5>Sliding Window</h5>
              </div>
              <div class="card-body">
              <img src={Sw} width="100%" />
              </div>
            </div>
            </a>
          </div>

          

          <div class="col-sm-3 col-6">
          <a href="/sliding-door">
            <div class="card">
              <div class="card-header">
                <h5>Sliding Door</h5>
              </div>
              <div class="card-body">
              <img src={Sd} width="100%" />
              </div>
            </div>
            </a>
          </div>

          <div class="col-sm-3 col-6">
          <a href="/ventilators">
            <div class="card">
              <div class="card-header">
                <h5>Ventilators</h5>
              </div>
              <div class="card-body">
              <img src={Vent} width="100%" />
              </div>
            </div>
            </a>
          </div>

          <div class="col-sm-3 col-6">
          <a href="/fixed-windows">
            <div class="card">
              <div class="card-header">
                <h5>Fixed Windows</h5>
              </div>
              <div class="card-body">
              <img src={fixedW} width="100%" />
              </div>
            </div>
            </a>
          </div>

          <div class="col-sm-3 col-6">
          <a href="/top-hung">
            <div class="card">
              <div class="card-header">
                <h5>Top Hung</h5>
              </div>
              <div class="card-body">
              <img src={TopHung} width="100%" />
              </div>
            </div>
            </a>
          </div>
         
        </div>
      </div>
    </div>

      </div>
    );
};
    
export default App;