async (page) => {
  const base = `http://localhost:5173/?compat=${Date.now()}#`
  const out = 'output/playwright'
  const reports = []

  async function waitForText(text) {
    await page.waitForFunction((value) => document.body.innerText.includes(value), text, { timeout: 12000 })
  }

  async function resetAndLogin(width, height) {
    await page.setViewportSize({ width, height })
    await page.goto(`${base}/pages/login/index`, { waitUntil: 'load' })
    await page.evaluate(async () => {
      localStorage.clear()
      sessionStorage.clear()
      if ('databases' in indexedDB && indexedDB.databases) {
        const databases = await indexedDB.databases()
        await Promise.all(
          databases.map((db) => {
            if (!db.name) return undefined
            return new Promise((resolve) => {
              const request = indexedDB.deleteDatabase(db.name)
              request.onsuccess = request.onerror = request.onblocked = resolve
            })
          })
        )
      }
    })
    await page.reload({ waitUntil: 'load' })
    await waitForText('微信一键登录')
    await page.locator('.wechat').click()
    await waitForText('今天想')
  }

  async function inspect(label) {
    const data = await page.evaluate((label) => {
      const viewportWidth = document.documentElement.clientWidth
      const viewportHeight = document.documentElement.clientHeight
      const scrolling = document.scrollingElement || document.documentElement
      const nodes = Array.from(document.querySelectorAll('*'))
      const overflowers = nodes
        .map((el) => {
          const rect = el.getBoundingClientRect()
          const style = getComputedStyle(el)
          return {
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === 'string' ? el.className : '',
            text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            position: style.position
          }
        })
        .filter((item) => item.width > 0 && (item.left < -1 || item.right > viewportWidth + 1))
        .slice(0, 12)

      const clippedButtons = Array.from(document.querySelectorAll('button, uni-button'))
        .map((el) => {
          const rect = el.getBoundingClientRect()
          return {
            className: typeof el.className === 'string' ? el.className : '',
            text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            radius: getComputedStyle(el).borderRadius
          }
        })
        .filter((item) => item.scrollWidth > item.clientWidth + 1 || item.scrollHeight > item.clientHeight + 1)
        .slice(0, 12)

      function rectFor(selector) {
        const el = document.querySelector(selector)
        if (!el) return null
        const rect = el.getBoundingClientRect()
        const style = getComputedStyle(el)
        return {
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          radius: style.borderRadius,
          position: style.position
        }
      }

      return {
        label,
        url: location.href,
        viewport: { width: viewportWidth, height: viewportHeight },
        scroll: {
          width: scrolling.scrollWidth,
          clientWidth: scrolling.clientWidth,
          height: scrolling.scrollHeight,
          clientHeight: scrolling.clientHeight
        },
        safePage: rectFor('.safe-page'),
        tabbar: rectFor('.tabbar'),
        statusBar: rectFor('.mock-status-bar'),
        menuActions: rectFor('.menu-actions'),
        ratingActions: rectFor('.rating-actions'),
        overflowers,
        clippedButtons,
        bodyText: document.body.innerText.replace(/\s+/g, ' ').slice(0, 220)
      }
    }, label)
    reports.push(data)
    return data
  }

  async function goto(route, marker) {
    await page.goto(`${base}${route}`, { waitUntil: 'load' })
    if (marker) await waitForText(marker)
    await page.evaluate(() => window.scrollTo(0, 0))
  }

  for (const viewport of [
    { width: 360, height: 800, name: '360-home' },
    { width: 375, height: 667, name: '375-home' },
    { width: 390, height: 844, name: '390-home' },
    { width: 414, height: 896, name: '414-home' }
  ]) {
    await resetAndLogin(viewport.width, viewport.height)
    await page.screenshot({ path: `${out}/compat-${viewport.name}.png`, fullPage: true })
    await inspect(`home-${viewport.name}`)
  }

  for (const viewport of [
    { width: 390, height: 844, name: '390' },
    { width: 2048, height: 958, name: 'desktop-2048' }
  ]) {
    await resetAndLogin(viewport.width, viewport.height)
    await page.screenshot({ path: `${out}/compat-${viewport.name}-home.png`, fullPage: true })
    await inspect(`${viewport.name}-home`)

    await goto('/pages/menu/index', '提交菜单')
    await page.screenshot({ path: `${out}/compat-${viewport.name}-menu.png`, fullPage: true })
    await inspect(`${viewport.name}-menu`)

    await goto('/pages/rating/index?recordId=record-hongshaorou', '提交评分')
    await page.screenshot({ path: `${out}/compat-${viewport.name}-rating.png`, fullPage: true })
    await inspect(`${viewport.name}-rating`)
  }

  return reports
}
