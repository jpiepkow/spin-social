import React from 'react';
import { observer } from 'mobx-react';
import img from '../Assets/facebookShare.jpg';
import { ShareButtons, generateShareIcon } from 'react-share';
import CopyToClipboard from 'react-copy-to-clipboard';
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const {
  FacebookShareButton,
  TwitterShareButton,
} = ShareButtons;
var Share = props => {

  return (
    <div className="share-flex">
      <FacebookShareButton
        url={props.url}
        title={'JOIN MY SPIN PLAYLIST'}
        picture={`https://spin.social/${img}`}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={props.url}
        title={'Join my spin party'}
        via={'Spin.social'}
        hashTags={[ '#spinparty' ]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <CopyToClipboard text={props.copyText} onCopy={() => {
        props.notifyCopy();
      }}>
      <svg viewBox="0 0 32 32" fill="white" width="32" height="32" className="social-icon">
        <g>
          <circle cx="16" cy="16" r="15.5" fill="#6d15e6"></circle>
        </g>
        <g transform="translate(7,7) scale(.55)">
          <path d="M13.757 19.868c-0.416 0-0.832-0.159-1.149-0.476-2.973-2.973-2.973-7.81 0-10.783l6-6c1.44-1.44 3.355-2.233 5.392-2.233s3.951 0.793 5.392 2.233c2.973 2.973 2.973 7.81 0 10.783l-2.743 2.743c-0.635 0.635-1.663 0.635-2.298 0s-0.635-1.663 0-2.298l2.743-2.743c1.706-1.706 1.706-4.481 0-6.187-0.826-0.826-1.925-1.281-3.094-1.281s-2.267 0.455-3.094 1.281l-6 6c-1.706 1.706-1.706 4.481 0 6.187 0.635 0.635 0.635 1.663 0 2.298-0.317 0.317-0.733 0.476-1.149 0.476z"></path>
          <path d="M8 31.625c-2.037 0-3.952-0.793-5.392-2.233-2.973-2.973-2.973-7.81 0-10.783l2.743-2.743c0.635-0.635 1.664-0.635 2.298 0s0.635 1.663 0 2.298l-2.743 2.743c-1.706 1.706-1.706 4.481 0 6.187 0.826 0.826 1.925 1.281 3.094 1.281s2.267-0.455 3.094-1.281l6-6c1.706-1.706 1.706-4.481 0-6.187-0.635-0.635-0.635-1.663 0-2.298s1.663-0.635 2.298 0c2.973 2.973 2.973 7.81 0 10.783l-6 6c-1.44 1.44-3.355 2.233-5.392 2.233z"></path>
        </g>
      </svg>
      </CopyToClipboard>
    </div>
  );
};

export default observer(Share);
