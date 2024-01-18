import React from 'react';
import  './ImageLinkForm.css'


const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div className='C'>
            <p className='f3'>
                {'This Magic brain will detect faces in your picters.'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-1'>
                    <input className='f4 pa2 w-70 center' type='tex' onChange={ onInputChange }/>
                    <button
                        className='button w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                        onClick={ onButtonSubmit }
                        >Detect
                    </button>
                </div>
            </div>
        </div>
    );
}

//'flex justify-center items-center vh-100'


export default ImageLinkForm;