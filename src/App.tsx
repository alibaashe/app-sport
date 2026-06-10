/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Matches } from './pages/Matches';
import { Channels } from './pages/Channels';
import { Watch } from './pages/Watch';
import { Support } from './pages/Support';
import { PlaylistPage } from './pages/PlaylistPage';
import { ApiDataPage } from './pages/ApiDataPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="matches" element={<Matches />} />
          <Route path="channels" element={<Channels />} />
          <Route path="watch/:id" element={<Watch />} />
          <Route path="playlist" element={<PlaylistPage />} />
          <Route path="api-data" element={<ApiDataPage />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
