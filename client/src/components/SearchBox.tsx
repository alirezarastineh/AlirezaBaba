import React, { useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // Navigating to the search route with the query as a URL parameter, or to the search route without any parameters if the query is empty
    navigate(query ? `/search?query=${query}` : "/search");
  };

  // Rendering a form with an input group that includes a text input field for the query and a submit button
  return (
    <Form className="flex-grow-1 d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          placeholder="Search AlirezaBaba"
          aria-label="Search AlirezaBaba"
          aria-describedby="button-search"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search" />
        </Button>
      </InputGroup>
    </Form>
  );
}
