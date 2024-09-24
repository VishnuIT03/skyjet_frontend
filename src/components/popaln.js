import React from 'react';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const cardStyle = {
  width: '200px',
  margin: '20px',
  textAlign: 'center',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  borderRadius: '10px',
  background: '#ffd597',
  padding: '10px',
  transition: 'transform 0.2s',
  cursor: 'pointer',
};

const imageStyle = {
  width: '100%',
  height: '80%',// Adjust the image opacity
  borderRadius: '8px', // Add a slight border radius to the image
};

const cardHover = {
  transform: 'scale(1.05)', // Scale up on hover
};

const Card = ({ airlineName, imageUrl }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{ ...cardStyle, ...(hovered && cardHover) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 style={{fontWeight:'bolder',fontSize:'25px',color:''}}>{airlineName}</h3>
      <img style={imageStyle} src={imageUrl} alt={`${airlineName} Logo`} />
    </div>
  );
};

const App = () => {
  return (
    <div>
        <h1 style={{color:'red',fontSize:'40px',fontWeight:'bolder'}}>
        Popular Airlines
        </h1><br/><br/>
    <div style={containerStyle}>
      <Card airlineName="Fly Emirates" imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/150px-Emirates_logo.svg.png" />
      <Card airlineName="Air India" imageUrl="https://presentations.gov.in/presgov_new/wp-content/uploads/2020/06/Preview-2.png?x42937" />
      <Card airlineName="SpiceJet" imageUrl="https://mir-s3-cdn-cf.behance.net/projects/404/1b4e16156237317.Y3JvcCwxODc1LDE0NjYsMCwxOA.jpg" />
    </div>
    </div>
  );
};

export default App;
