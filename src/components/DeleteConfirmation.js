import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function DeleteConfirmation(props) {

  const selectedEntry = props.selectedEntrySlug

  return (
    <>
      <Modal
        show={props.showConfirmation}
        onHide={props.handleCloseConfirmation}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Are you sure you want to delete this entry?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleCloseConfirmation}>
            No, go back
          </Button>
          <Button variant="danger" onClick={event => props.handleDelete(event, selectedEntry)}>
          Yes, I'm sure, delete it
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
