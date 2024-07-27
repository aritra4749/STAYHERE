import React from 'react'
import { useState} from "react";
import BeatLoader from "react-spinners/BeatLoader";
// import { css } from '@emotion/react';
function Loading() {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#1ce0b5");
//     const override = css`
//     display: block;
//     margin: 0 auto;
//     border-color: red;
// `;
      
      return (
        <div style={{marginTop:'300px'}}>
            <div className="sweet-loading text-center">
          
          <BeatLoader
            color={color}
            loading={loading}
            css=''
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        </div>
      );
}

export default Loading