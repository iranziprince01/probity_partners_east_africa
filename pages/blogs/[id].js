import Link from "next/link";
import { useRouter } from "next/router";
import blogs from "../../data/blogs.json";
import styles from "../../styles/blogs.module.css";

export default function BlogDetail() {
  const router = useRouter();
  const { id } = router.query;
  const blog = blogs.find((b) => b.id === Number(id));
  if (!blog) return <div className={styles.container}>Loading...</div>;
  return (
    <div className={styles.container}>
      <Link href="/blogs">
        <a className={styles.backLink}>← Back to Blogs</a>
      </Link>
      <div className={styles.detailCard}>
        <img src={blog.image} alt={blog.title} className={styles.detailImage} />
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.meta}>
          <span>{blog.author}</span>
          <span> | {blog.source}</span>
          <span> | {new Date(blog.date).toLocaleDateString()}</span>
        </div>
        <p className={styles.excerpt}>{blog.excerpt}</p>
      </div>
    </div>
  );
}
