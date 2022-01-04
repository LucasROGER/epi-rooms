import React from 'react';
import styles from '../styles/Caption.module.css'

export const Caption = ({color, text}) => {
  return (
    <div style={{display: "flex", alignItems: "center", marginBottom: 10}}>
      <div className={styles.caption} style={{backgroundColor: color, marginLeft: 50}}>&nbsp;</div>
      <p style={{marginBottom: 0, marginTop: 0, marginLeft: 10, fontWeight: "bold", fontSize: '1.5vw', color: 'white'}}>{text}</p>
    </div>
  )
};
