import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'
import { getRouter } from './router'
// Initialise the MF runtime so initPromise resolves before the remote Widget loads.
import '__mf__virtual/__mfe_internal__host__H_A_I__hostAutoInit__H_A_I__'

const router = getRouter()

hydrateRoot(document, <StartClient router={router} />)
