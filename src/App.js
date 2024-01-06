import React from 'react';
import { Collection } from './Collection';
import './index.scss';

function App() {
  const [categoryId, setCategoryId] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [allCollections, setAllCollections] = React.useState(0);
  const [quantityPage, setQuantityPage] = React.useState(0);
  const [collections, setCollections] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');

  const cats =  [
    { "name": "Все" },
    { "name": "Море" },
    { "name": "Горы" },
    { "name": "Архитектура" },
    { "name": "Города" }
  ];
  const limit = 3; // 3 - выбранный лимит количества карточек отображаемых на странице

  // Расчет необходимого количества страниц
  const checkQuantityPage = (all) => {
    console.log(all);
    let A = Math.floor((all)/limit);    
    let B = all%limit;
    if    (B > 0) {
      setQuantityPage(A + 1);
    } else {
      setQuantityPage(A);
    }
  }

  // useEffect считывает общее количество карточек в коллекции, чтобы далее рассчитать кол-во страниц
  // В mockapi нельзя запросить количество карточек
  React.useEffect(() => {
    const category = categoryId ? `category=${categoryId}` : '';

    fetch(`https://6596af5e6bb4ec36ca0325ce.mockapi.io/photo_collections?${category}`)
      .then((res) => res.json())
      .then((json) => {
        setAllCollections(json.length)
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении данных');
      })
      .finally(() => {
      checkQuantityPage(allCollections);
    });
  }, [categoryId, allCollections]);

  React.useEffect(() => {
    setIsLoading(true);
    const category = categoryId ? `category=${categoryId}` : '';

    fetch(
      `https://6596af5e6bb4ec36ca0325ce.mockapi.io/photo_collections?page=${page}&limit=${limit}&${category}`,
      )
      .then((res) => res.json())
      .then((json) => setCollections(json))
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении данных');
      })
      .finally(() => {
        setIsLoading(false)});
  }, [categoryId, page]);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {
            cats.map((obj,i) => (<li onClick={() => setCategoryId(i)} className={categoryId== i ? 'active' : ''} key={obj.name}>{obj.name}</li>))
          }
        </ul>
        <input 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input" 
          placeholder="Поиск по названию" />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Идет загрузка...</h2>
          ) : (
            collections
            .filter((obj) => obj.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((obj, index) => (
              <Collection
                key={index}
                name={obj.name}
                images={obj.photos}
              />
            ))
        )}
      </div>
      <ul className="pagination">
        {
          [...Array(quantityPage)].map((_,i) => <li onClick={() => setPage(i+1)} 
          className={page == i + 1 ? 'active' : ''} key={i}>{i+1}</li>)
        }
      </ul>
    </div>
  );
}

export default App;
