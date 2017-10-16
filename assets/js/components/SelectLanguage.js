import React from 'react';
import PropTypes from 'prop-types';
import '../../css/app.sass';

const SelectLanguage = (props) => {
  const languages = ["All", "Java", "JS", "Python", "Ruby"];
  
  return (
    <ul className="languages">
      {languages.map(lang => {

        const active = (lang === props.selectedLanguage) ? "active" : "";

        return (
          <li
            className={active} 
            key={lang}
            onClick={props.onSelect.bind(null, lang)}
          >
            {lang}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default SelectLanguage;