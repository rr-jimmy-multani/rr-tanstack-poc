import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { ThemeContext } from '@rr-framework/shared'

const hostTheme = { primaryColour: '#e2001a', label: 'host' }

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TanStack Start + Module Federation POC' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeContext.Provider value={hostTheme}>
          <Outlet />
        </ThemeContext.Provider>
        <Scripts />
      </body>
    </html>
  )
}
