import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesWeb from './components/ParticlesWeb/ParticlesWeb';
import Rank from './components/Rank/Rank';
import './App.css';

const returnClarifaiRequestOptions = (imageURL, model) => {
  const PAT = 'ca483c7301344d65919b1a418bf9835b';
  const USER_ID = 'danel2005';
  const APP_ID = 'test';
  const MODEL_ID = model;
  const IMAGE_URL = imageURL;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}

const initialState = {
  input: '',
  imageURL: '',
  boxes: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email:  data.email,
      entries:  data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (faceValues) => {
    const image = document.getElementById('input_image');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: faceValues.leftCol * width,
      topRow: faceValues.topRow * height,
      rightCol: width - (faceValues.rightCol * width),
      bottomRow: height - (faceValues.bottomRow * height)
    }
  }

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  fetchResponse = (model) => {
    let faceBoxes = [];
    return fetch("https://api.clarifai.com/v2/models/" + model + "/outputs", returnClarifaiRequestOptions((this.state.input), model))
      .then(response => response.json())
      .then(result => {
        const regions = result.outputs[0].data.regions;
        if(regions) {
          faceBoxes = result.outputs[0].data.regions.map(region => {
            const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);
            const faceValues = { boundingBox, topRow, leftCol, bottomRow, rightCol };
            return this.calculateFaceLocation(faceValues);
          });

          return faceBoxes;
        }
      }
      )
      .catch(error => console.log('error', error));
    return [];
  }

  onButtonSubmit = async () => {
    this.setState({ imageURL: this.state.input });

    const faces = await this.fetchResponse("face-detection");
    if(faces) this.displayFaceBox(faces);
      
    if(faces) {
      fetch('https://smart-brain-api-pmt4.onrender.com/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count}));
      })
      .catch(console.log);
    }
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    } else if(route === 'home') {
      this.setState({isSignedIn: true})
    }

    this.setState({route: route});
  }

  render() {
    const {input, imageURL, boxes, route, isSignedIn} = this.state;

    return (
      <div className='App'>
        <ParticlesWeb />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {
          route === 'home'
            ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>``
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageURL={imageURL} />
            </div>
            : (
                route === 'signin' 
                ? <Signin loadUser={this.loadUser} isSignedIn={this.isSignedIn} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            ) 
        }
      </div>
    );
  };
}

export default App;
