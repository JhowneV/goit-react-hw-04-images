import React, { useState, useEffect } from 'react';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { SearchBar } from './SearchBar/SearchBar';
import css from './App.module.css';
import { getAPI } from '../pixabay-api';
import toast, { Toaster } from 'react-hot-toast';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]); // Initialized as an empty array
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    if (!search) return;

    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const fetchedImages = await getAPI(search, page);
        const { hits, totalHits } = fetchedImages;

        if (hits.length === 0) {
          toast.error(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }

        if (page === 1) {
          toast.success(`Hooray! We found ${totalHits} images!`);
        }

        if (page * 12 >= totalHits) {
          setIsEnd(true);
          toast("We're sorry, but you've reached the end of search results.", {
            icon: '👏',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        }

        setImages((prevImages) => [...prevImages, ...hits]);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [search, page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSearch = e.target.search.value.trim().toLowerCase();

    if (newSearch !== search) {
      setSearch(newSearch);
      setPage(1);
      setImages([]); 
      setIsEnd(false);
    }
  };

  const handleClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const openModal = (largeImageURL) => {
    setLargeImageURL(String(largeImageURL));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      {images.length > 0 && (
        <ImageGallery images={images} onClick={openModal} />
      )}
      {images.length > 0 && !isEnd && !isLoading && ( <Button onClick={handleClick} />)}
      {isLoading && <Loader />}
      {isError && toast.error('Oops, something went wrong! Reload this page!')}
      <Toaster position="top-right" reverseOrder={false} />
      {showModal && <Modal onClose={closeModal} largeImageURL={largeImageURL} />}
    </div>
  );
};
