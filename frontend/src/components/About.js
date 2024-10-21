import React, { useEffect } from 'react';

function About() {
  useEffect(() => {
    // 在組件加載後立即跳轉到指定網址
    window.location.href = 'https://www.kaminzhi.com/posts/Profile';
  }, []);

  // 返回一個加載中的提示，雖然這個提示可能不會顯示很長時間
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-semibold">正在跳轉...</p>
    </div>
  );
}

export default About;
