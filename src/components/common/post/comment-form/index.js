import React from "react";
import { FormControl, Form, Button } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import i18n from "../../../../i18n";

function CommentForm(props) {
  const newComment = React.useRef();
  return (
    <Form className="text-left" onSubmit={(e) => {
      e.preventDefault();
      props.onSubmit(newComment.current && newComment.current.value);
    }}>
      <label htmlFor="newComment">{i18n.t("post.comment")}</label>
      <FormControl id="newComment"
                   required
                   ref={newComment}
                   as="textarea"
                   aria-label="Comment"
                   aria-describedby="new-post-comment"/>
      <Form.Group className="pt-3 text-right">
        <Button variant="secondary" type="submit">{i18n.t("post.leave-comment")}</Button>
      </Form.Group>
    </Form>
  );
}

export default withTranslation()(CommentForm);
