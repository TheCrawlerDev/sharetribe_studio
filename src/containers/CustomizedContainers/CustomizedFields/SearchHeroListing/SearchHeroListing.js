import React, { Component } from 'react';
import css from './SeachHeroListing.module.css';
import { googlePlace, googlePlaceByCoords, googlePlaces } from '../../../../util/api';
import IconCurrentLocation from '../../../../components/LocationAutocompleteInput/IconCurrentLocation';

const AutoComplete = props => {
  const [options, setOptions] = React.useState([]);
  const [optionChoosed, setOptionChoosed] = React.useState({ id: null });
  const [search, setSearchValue] = React.useState('');
  const [enableCurrentLocation, setEnableCurrentLocation] = React.useState(false);
  const [inputOptionsOver, setInputOptionsOver] = React.useState(false);
  const [userLocation, setUserLocation] = React.useState(null);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      error => {
        // display an error if we cant get the users position
        console.error('Error getting user location:', error);
      }
    );
  } else {
    // display an error if not supported
    console.error('Geolocation is not supported by this browser.');
  }

  const handleClickAutoComplete = value => {
    setSearchValue(`${value.description}`);
    googlePlace(value.place_id).then(data => {
      setOptionChoosed(data.data.result);
      setOptions([]);
    });
  };
  const autoComplete = event => {
    setSearchValue(event.target.value);
    if (event.target.value.length > 0) {
      googlePlaces(event.target.value).then(data => {
        if (data.data.status == 'OK') {
          setOptions(data.data.predictions);
        } else {
          console.log('Google Places Error!');
          setOptions([]);
        }
      });
    } else {
      setOptionChoosed({ id: null });
      setOptions([]);
    }
  };

  const submit = () => {
    let distance = '8.787793510048296';
    if (search.length < 1) {
      return;
    }
    if (optionChoosed.place_id !== null) {
      let queryParams = [
        `lq=${encodeURI(`${optionChoosed.formatted_address}`)}`,
        `ls=OK`,
        `lc=${optionChoosed.geometry.location.lat},${optionChoosed.geometry.location.lng}`,
        // `boundingbox=${optionChoosed.geometry.viewport.southwest.lat},${optionChoosed.geometry.viewport.southwest.lng},${optionChoosed.geometry.viewport.northeast.lat},${optionChoosed.geometry.viewport.northeast.lng}`,
        `bounds=${optionChoosed.geometry.viewport.northeast.lat},${optionChoosed.geometry.viewport.northeast.lng},${optionChoosed.geometry.viewport.southwest.lat},${optionChoosed.geometry.viewport.southwest.lng}`,
        `distance_max=${distance}`,
      ];
      window.location.href = `/s?${queryParams.join('&')}`;
    } else {
      window.location.href = `/s?lq=${encodeURI(search)}&ls=OK&distance_max=${distance}`;
    }
  };

  const submitMyCurrentLocation = (lat, lng) => {
    if (lat == undefined || lng == undefined || lat == null || lng == null) {
      return alert('You need to enable your location');
    }
    googlePlaceByCoords(lat, lng).then(data => {
      if(data.ok == false || data.data.results.length == 0){
        return alert('We cannot find your location');
      }
      let placeCity = data.data.results[0];
      console.log({placeCity});
      let distance = '8.787793510048296';
      let queryParams = [
        `ls=OK`,
        `lc=${placeCity.geometry.location.lat},${placeCity.geometry.location.lng}`,
        `bounds=${placeCity.geometry.viewport.northeast.lat},${placeCity.geometry.viewport.northeast.lng},${placeCity.geometry.viewport.southwest.lat},${placeCity.geometry.viewport.southwest.lng}`,
        `distance_max=${distance}`,
      ];
      window.location.href = `/s?${queryParams.join('&')}`;
    });
  };

  return (
    <>
      <div
        className={css.wrapper}
        onMouseLeave={() => setTimeout(() => setInputOptionsOver(false), 2000)}
        onMouseOver={() => setInputOptionsOver(true)}
      >
        <div style={{ width: '70%' }}>
          <input
            name="search"
            className={css.input}
            value={search}
            type="text"
            autoComplete="off"
            placeholder="Search by location..."
            onChange={autoComplete}
            onClick={() => setInputOptionsOver(true)}
          />
        </div>
        <div style={{ width: '70%' }}>
          {(options.length !== 0 || inputOptionsOver) && (
            <div className={css.dataResult}>
              <div
                key="My current location"
                className={css.myCurrentLocationLabel}
                onClick={() =>
                  submitMyCurrentLocation(userLocation?.latitude, userLocation?.longitude)
                }
              >
                <IconCurrentLocation /> <p style={{ color: 'white' }}>My Current Location</p>
              </div>
              {options.slice(0, 15).map(value => (
                <div
                  key={value.place_id}
                  className={css.dataItem}
                  onClick={() => handleClickAutoComplete(value)}
                >
                  <p style={{ color: 'black' }}>{value.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ width: '30%' }}>
          <button className={css.searchSubmit} type="submit" onClick={submit}>
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export class SearchHeroHome extends Component {
  render() {
    const onSubmit = async values => {
      // alert(JSON.stringify(values));
    };

    return <AutoComplete></AutoComplete>;
  }
}
