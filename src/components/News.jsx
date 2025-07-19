import NewsItem from "./NewsItem";
import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null); // Use nextPage token instead of page number
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);

  const updateNews = async () => {
    try {
      props.setProgress(10);
      
      const apiKey = "pub_4e9f6cdf19834f0aa55199dcc4227a05";
      
      // Use consistent endpoint - stick with /latest
      let url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&size=${props.pageSize}`;
      
      // Add country filter
      if (props.country && props.country !== 'us') {
        url += `&country=${props.country}`;
      }
      
      // Add category filter
      if (props.category && props.category !== 'general') {
        const categoryMap = {
          'business': 'business',
          'entertainment': 'entertainment',
          'health': 'health', 
          'science': 'science',
          'sports': 'sports',
          'technology': 'technology',
          'general': ''
        };
        
        const mappedCategory = categoryMap[props.category];
        if (mappedCategory) {
          url += `&category=${mappedCategory}`;
        }
      }
      
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      props.setProgress(30);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const parsedData = await response.json();
      props.setProgress(70);
      
      if (parsedData.status === "success" && parsedData.results) {
        setArticle(parsedData.results);
        setTotalResults(parsedData.totalResults || parsedData.results.length);
        setNextPage(parsedData.nextPage || null); // Store the nextPage token
      } else {
        throw new Error(parsedData.message || "Failed to fetch news data");
      }
      
      setLoading(false);
      props.setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error.message);
      setLoading(false);
      props.setProgress(100);
    }
  };

  useEffect(() => {
    document.title = `${props.category} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  }, [props.category, props.country]); // Add props.country as dependency

  const fetchMoreData = async () => {
    // Don't fetch if there's no nextPage token
    if (!nextPage) {
      return;
    }
    
    try {
      const apiKey = "pub_4e9f6cdf19834f0aa55199dcc4227a05";
      
      // Use the same endpoint and URL construction as updateNews
      let url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&size=${props.pageSize}&page=${nextPage}`;
      
      // Add country filter
      if (props.country && props.country !== 'us') {
        url += `&country=${props.country}`;
      }
      
      // Add category filter
      if (props.category && props.category !== 'general') {
        const categoryMap = {
          'business': 'business',
          'entertainment': 'entertainment',
          'health': 'health', 
          'science': 'science',
          'sports': 'sports',
          'technology': 'technology',
          'general': ''
        };
        
        const mappedCategory = categoryMap[props.category];
        if (mappedCategory) {
          url += `&category=${mappedCategory}`;
        }
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const parsedData = await response.json();
      
      if (parsedData.status === "success" && parsedData.results) {
        setArticle(prevArticles => [...prevArticles, ...parsedData.results]);
        setNextPage(parsedData.nextPage || null); // Update nextPage token
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
      // Set nextPage to null to stop further requests on error
      setNextPage(null);
    }
  };

  // Error display component
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading News</h4>
          <p>Unable to fetch news articles: {error}</p>
          <hr />
          <p className="mb-0">Please try refreshing the page or check your internet connection.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center" style={{ margin: "40px 0px", marginTop: "90px" }}>
        NewsMonkey - Top {props.category} headlines
      </h1>  
      {loading && articles.length === 0 && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={nextPage !== null} // Check if nextPage token exists
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles && articles.length > 0 ? articles.map((element, index) => {
              return (
                <div className="col-md-4" key={element.article_id || element.link || index}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 50) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 90)
                        : ""
                    }
                    imageUrl={element.image_url}
                    newsUrl={element.link}
                    author={element.creator ? element.creator[0] : "Unknown"}
                    date={element.pubDate}
                    source={element.source_id}
                  />
                </div>
              );
            }) : (
              !loading && (
                <div className="col-12">
                  <p className="text-center">No articles found for this category.</p>
                </div>
              )
            )}
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