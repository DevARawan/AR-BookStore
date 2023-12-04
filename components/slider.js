import { View, Text } from 'react-native'
import React,{useState,useEffect} from 'react';
import { SliderBox } from "react-native-image-slider-box";

const ImageSlider = () => {
    const [images, setImages] = useState([
        require('./images/bk.jpg'),
        require('./images/lol.jpg'),
        require('./images/jon.jpg'),
        require('./images/pol.jpg'),
        require('./images/lop.jpg'),
        require('./images/pk.jpg'),
        
      ]);
      return (
        <View>
         <SliderBox
            images={images}
            dotColor="lightgrey"
            inactiveDotColor="white"
            activeDotColor="black"
            paginationBoxVerticalPadding={20}
            autoplay
            circleLoop
            ImageComponentStyle={{ borderRadius: 15, width: "97%", marginTop: 5 }}
          />
        </View>
      )
    }
    
    export default ImageSlider