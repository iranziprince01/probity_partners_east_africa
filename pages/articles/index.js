import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "../../styles/articles.module.css";
import { shareOn } from "../../utils/share";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [displayed, setDisplayed] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 6;

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setDisplayed(data.slice(0, perPage));
        setHasMore(data.length > perPage);
      });
  }, []);

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase())
  );

  const fetchMore = () => {
    const next = filtered.slice(displayed.length, displayed.length + perPage);
    setDisplayed(displayed.concat(next));
    setHasMore(displayed.length + next.length < filtered.length);
  };

  useEffect(() => {
    setDisplayed(filtered.slice(0, perPage));
    setHasMore(filtered.length > perPage);
  }, [search, articles]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Articles</h1>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <InfiniteScroll
        dataLength={displayed.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>No more articles.</p>}
      >
        <div className={styles.grid}>
          {displayed.map((article) => (
            <div className={styles.card} key={article.id}>
              <img
                src={article.image}
                alt={article.title}
                className={styles.image}
              />
              <div className={styles.content}>
                <Link href={`/articles/${article.id}`}>
                  <a>
                    <h2>{article.title}</h2>
                  </a>
                </Link>
                <p className={styles.excerpt}>{article.excerpt}</p>
                <div className={styles.meta}>
                  <span>{article.author}</span>
                  <span> | {new Date(article.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.share}>
                  <button
                    onClick={() =>
                      shareOn("twitter", window.location.href, article.title)
                    }
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() =>
                      shareOn("linkedin", window.location.href, article.title)
                    }
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() =>
                      shareOn("facebook", window.location.href, article.title)
                    }
                  >
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
