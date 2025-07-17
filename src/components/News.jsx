import NewsItem from "./NewsItem";
import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=d451521163d6459389ef0a37a0768b5f&page=1&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticle(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setPage(1); // Reset page to 1 when updating news
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${props.category} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  }, [props.category]); // Add props.category as dependency

  // Infinite scrolling
  const fetchMoreData = async () => {
    const nextPage = page + 1;
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=d451521163d6459389ef0a37a0768b5f&page=${nextPage}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticle(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setPage(nextPage); // Update page after successful fetch
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: "40px 0px", marginTop: "90px" }}>
        NewsMonkey - Top {props.category} headlines
      </h1>  
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 50) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 90)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func,
};

export default News;