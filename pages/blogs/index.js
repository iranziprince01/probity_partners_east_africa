import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "../../styles/blogs.module.css";
import { shareOn } from "../../utils/share";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [displayed, setDisplayed] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 6;

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setDisplayed(data.slice(0, perPage));
        setHasMore(data.length > perPage);
      });
  }, []);

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const fetchMore = () => {
    const next = filtered.slice(displayed.length, displayed.length + perPage);
    setDisplayed(displayed.concat(next));
    setHasMore(displayed.length + next.length < filtered.length);
  };

  useEffect(() => {
    setDisplayed(filtered.slice(0, perPage));
    setHasMore(filtered.length > perPage);
  }, [search, blogs]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Blogs</h1>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <InfiniteScroll
        dataLength={displayed.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>No more blogs.</p>}
      >
        <div className={styles.grid}>
          {displayed.map((blog) => (
            <div className={styles.card} key={blog.id}>
              <img src={blog.image} alt={blog.title} className={styles.image} />
              <div className={styles.content}>
                <Link href={`/blogs/${blog.id}`}>
                  <a>
                    <h2>{blog.title}</h2>
                  </a>
                </Link>
                <p className={styles.excerpt}>{blog.excerpt}</p>
                <div className={styles.meta}>
                  <span>{blog.author}</span>
                  <span> | {blog.source}</span>
                  <span> | {new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.share}>
                  <button
                    onClick={() =>
                      shareOn("twitter", window.location.href, blog.title)
                    }
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() =>
                      shareOn("linkedin", window.location.href, blog.title)
                    }
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() =>
                      shareOn("facebook", window.location.href, blog.title)
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
