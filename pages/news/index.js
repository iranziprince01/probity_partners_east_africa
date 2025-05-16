import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "../../styles/news.module.css";
import { shareOn } from "../../utils/share";

export default function News() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [displayed, setDisplayed] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 6;

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setDisplayed(data.slice(0, perPage));
        setHasMore(data.length > perPage);
      });
  }, []);

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      n.author.toLowerCase().includes(search.toLowerCase())
  );

  const fetchMore = () => {
    const next = filtered.slice(displayed.length, displayed.length + perPage);
    setDisplayed(displayed.concat(next));
    setHasMore(displayed.length + next.length < filtered.length);
  };

  useEffect(() => {
    setDisplayed(filtered.slice(0, perPage));
    setHasMore(filtered.length > perPage);
  }, [search, news]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>News</h1>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <InfiniteScroll
        dataLength={displayed.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>No more news.</p>}
      >
        <div className={styles.grid}>
          {displayed.map((item) => (
            <div className={styles.card} key={item.id}>
              <img src={item.image} alt={item.title} className={styles.image} />
              <div className={styles.content}>
                <Link href={`/news/${item.id}`}>
                  <a>
                    <h2>{item.title}</h2>
                  </a>
                </Link>
                <p className={styles.excerpt}>{item.excerpt}</p>
                <div className={styles.meta}>
                  <span>{item.author}</span>
                  <span> | {new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.share}>
                  <button
                    onClick={() =>
                      shareOn("twitter", window.location.href, item.title)
                    }
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() =>
                      shareOn("linkedin", window.location.href, item.title)
                    }
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() =>
                      shareOn("facebook", window.location.href, item.title)
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
