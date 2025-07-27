"use client";

import { Suspense } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import KanbanBoard from '@views/apps/kanban/KanbanBoard'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from '@views/apps/kanban/styles.module.css'
import withAuth from '@/utils/withAuth'

// Remove 'async' - client components cannot be async
const KanbanPage = () => {
  return (
    <div
      className={classnames(
        commonLayoutClasses.contentHeightFixed,
        styles.scroll,
        'is-full overflow-auto pis-2 -mis-2'
      )}
    >
      <Suspense fallback={<KanbanLoadingFallback />}>
        <KanbanBoard />
      </Suspense>
    </div>
  )
}

// Loading fallback component
const KanbanLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm text-gray-500">Loading Kanban board...</p>
      </div>
    </div>
  )
}

export default withAuth(KanbanPage)
