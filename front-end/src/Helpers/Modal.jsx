import React from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { observer } from 'mobx-react';

class View extends React.Component {
  handleClose = () => this.props.handleClose(false);
  render() {
    return (
      <div onClick={this.handleClick}>
        {
          this.props.showing && (
              <ModalContainer
                style={{ width: '100%' }}
                onClose={this.handleClose}
              >
                <ModalDialog
                  style={{ width: '95%', height:'80vh', minHeight:'300px', padding: '0px' }}
                  onClose={this.handleClose}
                >
                  {this.props.children}
                </ModalDialog>
              </ModalContainer>
            )
        }
      </div>
    );
  }
}
export default observer(View);
