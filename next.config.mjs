/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Đảm bảo file embeddings được đóng gói cùng route /api/chat khi deploy
  // (route đọc data/embeddings.json lúc chạy; nếu thiếu, RAG sẽ ngầm tắt).
  outputFileTracingIncludes: {
    '/api/chat': ['./data/embeddings.json'],
  },
}

export default nextConfig
