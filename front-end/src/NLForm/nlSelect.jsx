var React = require('react');

const NlSelect = (props, context) => (
  <span>
    {props.text}
    <div className="nl-field nl-dd">
      <ul>
        {props.select.map((x, index) => {
          return (
            <li
              className="blur"
              key={index.toString()}
              onClick={props.changeDefault.bind(
                this,
                props.selectName,
                x.value,
                x.key
              )}
            >
              {x.value}
            </li>
          );
        })}
      </ul>
    </div>
  </span>
);
export default NlSelect;
