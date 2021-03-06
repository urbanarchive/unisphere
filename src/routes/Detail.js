/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useContext } from 'react'
import { useParams } from "react-router-dom";
import MONUMENT from '../models/monument';
import { MapContext } from './App';
import { resultFactory } from '../models/monument';
import { DEFAULT_PADDING } from '../ui/Map';
import parse from 'html-react-parser';

function extractMonumentIdentifier(slug) {
  return slug.split('-').reverse()[0];
}

function Detail({ monuments }) {
  const map = useContext(MapContext);
  const [monument, setMonument] = useState(null);
  const { slug } = useParams();
  const id = extractMonumentIdentifier(slug);

  useEffect(() => {
    if (monuments.features) {
      const monument = monuments.features.find(m => m.properties.id === id);

      setMonument(resultFactory(monument));

      if (map) {
        map.easeTo({ center: monument.geometry.coordinates, zoom: 14, ...DEFAULT_PADDING  });
      }
    }
  }, [id, monuments, map]);

  return <>
    <div className="p-4">
      <h6 className='text-sm'>
        <img src={monument?.iconData} alt={monument?.properties[MONUMENT.TYPE]} className="w-8 h-8 inline mr-1" />
        {monument?.properties[MONUMENT.TYPE]}
      </h6>
      <h1 className='text-3xl font-feather'>{monument?.properties[MONUMENT.PLACE_NAME]}</h1>
    </div>
    {!!monument?.properties[MONUMENT.IMAGES]?.length && <img alt="Location image" className='w-full' src={monument?.properties[MONUMENT.IMAGES][0].url}/>}
    <div>
      {monument?.properties[MONUMENT.CITATION] &&
        <p className='text-sm p-1 text-right'>{monument?.properties[MONUMENT.CITATION]}</p>
      }
    </div>
    <div className='p-4 whitespace-pre-line wrap'>
      <p>
        {monument?.properties[MONUMENT.DESCRIPTION]}
      </p>
      {monument?.formattedSourceDescription &&
        <p className='text-sm p-1 whitespace-pre-line break-words'>
          Source: {parse(monument?.formattedSourceDescription)}
        </p>
      }
    </div>
  </>;
}

export default Detail;
