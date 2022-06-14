import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import Auth from "../utils/auth";
// import { getMe, deleteBook } from "../utils/API";
import { removeBookId } from "../utils/localStorage";
import { GET_ME } from "../utils/queries.js";
import { REMOVE_BOOK } from "../utils/mutations";

import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again

  const { data: userData, loading, error, refetch } = useQuery(GET_ME);
  // console.log(userData, "console string");
  const userDataLength = loading ? 0 : Object.keys(userData).length;
  // console.log(userDataLength, "UDL");

  // useEffect(() => {
  // const getUserData = async () => {
  //   try {
  //     const token = Auth.loggedIn() ? Auth.getToken() : null;

  //     if (!token) {
  //       return false;
  //     }

  //     const response = await getMe(token);

  //     // if (!response.ok) {
  //     //   throw new Error('something went wrong!');
  //     // }

  //     const user = await response.json();
  //     setUserData(user);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // getUserData();
  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database

  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      const response = await removeBook({
        variables: { bookId: bookId },
      });
      removeBookId(bookId);
      refetch();
    } catch (err) {
      console.error(err);
    }
    // try {
    //   const response = await deleteBook(bookId, token);
    //   if (!response.ok) {
    //     throw new Error("something went wrong!");
    //   }
    //   const updatedUser = await response.json();
    //   setUserData(updatedUser);
    // upon success, remove book's id from localStorage

    // } catch (err) {
    //   console.error(err);
    // }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.me.savedBooks.length
            ? `Viewing ${userData.me.savedBooks.length} saved ${
                userData.me.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.me.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
