async (page) => {
  const base = 'http://localhost:5173/#'
  const out = 'output/playwright'
  const results = {}

  await page.setViewportSize({ width: 390, height: 844 })

  async function waitForText(text) {
    await page.waitForFunction((value) => document.body.innerText.includes(value), text, { timeout: 10000 })
  }

  async function screenshot(name, marker) {
    if (marker) await waitForText(marker)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: `${out}/${name}.png` })
    results[name] = {
      url: page.url(),
      marker,
      excerpt: await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 260))
    }
  }

  async function goto(route, marker, name) {
    await page.goto(`${base}${route}`, { waitUntil: 'load' })
    await screenshot(name, marker)
  }

  await page.goto(`${base}/pages/login/index`, { waitUntil: 'load' })
  await page.evaluate(async () => {
    localStorage.clear()
    sessionStorage.clear()
    if ('databases' in indexedDB) {
      const databases = await indexedDB.databases()
      await Promise.all(databases.map((db) => (db.name ? new Promise((resolve) => {
        const request = indexedDB.deleteDatabase(db.name)
        request.onsuccess = request.onerror = request.onblocked = resolve
      }) : undefined)))
    }
  })
  await page.reload({ waitUntil: 'load' })
  await waitForText('微信一键登录')
  await page.locator('.wechat').click()
  await screenshot('home', '75 分钟')

  await goto('/pages/dishes/index', '新增菜品', 'dishes')
  await goto('/pages/dish-detail/index?id=hongshaorou', '1 / 8', 'dish-detail')
  await goto('/pages/menu/index', '75 分钟', 'menu')
  await goto('/pages/cook/index', '继续制作', 'cook')

  await page.getByText('继续制作', { exact: true }).click()
  await screenshot('cook-step', '步骤 2：炒鸡蛋')

  await goto('/pages/upload/index?dishId=hongshaorou', '2/3', 'upload')
  await goto('/pages/rating/index?recordId=record-hongshaorou', '综合评分', 'rating')
  await goto('/pages/mine/index', '46 次', 'mine')

  return results
}
