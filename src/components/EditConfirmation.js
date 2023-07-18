import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function EditConfirmation(props) {

  const selectedEntry = props.selectedEntrySlug

  return (
    <>
      <Modal
        show={props.showEditConfirmation}
        onHide={props.handleCloseEditConfirmation}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Are you sure you want to edit this entry?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleCloseEditConfirmation}>
            No, go back
          </Button>
          <Button variant="danger" onClick={event => props.handleEdit(event, selectedEntry)}>
          Yes, I'm sure, edit it
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
