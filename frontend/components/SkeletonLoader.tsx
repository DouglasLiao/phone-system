import React from 'react'

interface SkeletonLoaderProps {
  variant?: 'dashboard' | 'form'
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'dashboard' }) => {
  if (variant === 'form') {
    return (
      <div className="bg-primary rounded-lg shadow-md p-6 animate-pulse">
        {/* Form Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-primary-dark rounded w-64 mb-2"></div>
          <div className="h-4 bg-primary-light rounded w-96"></div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-6">
          {/* Idempotency Key Field */}
          <div>
            <div className="h-4 bg-primary-dark rounded w-32 mb-2"></div>
            <div className="h-10 bg-primary-light rounded w-full"></div>
          </div>

          {/* Area Code Field */}
          <div>
            <div className="h-4 bg-primary-dark rounded w-24 mb-2"></div>
            <div className="h-10 bg-primary-light rounded w-full"></div>
          </div>

          {/* Phone Number Field */}
          <div>
            <div className="h-4 bg-primary-dark rounded w-32 mb-2"></div>
            <div className="h-10 bg-primary-light rounded w-full"></div>
          </div>

          {/* Subscription Plan Field */}
          <div>
            <div className="h-4 bg-primary-dark rounded w-40 mb-2"></div>
            <div className="h-10 bg-primary-light rounded w-full"></div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <div className="h-12 bg-primary-dark rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary rounded-lg shadow-md animate-pulse">
      {/* Dashboard Header Skeleton */}
      <div className="p-6 border-b border-primary-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-primary-dark rounded mr-2"></div>
            <div className="h-8 bg-primary-dark rounded w-48"></div>
          </div>
          <div className="h-4 bg-primary-light rounded w-24"></div>
        </div>
      </div>

      {/* Dashboard Content Skeleton */}
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Skeleton Cards */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border border-primary-dark rounded-lg p-4 bg-background">
              {/* Card Header */}
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-primary-dark rounded mr-2"></div>
                  <div className="h-5 bg-primary-dark rounded w-32"></div>
                </div>
                <div className="h-3 bg-primary-light rounded w-20"></div>
              </div>

              {/* Card Content */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-primary-light rounded mr-2"></div>
                  <div className="h-4 bg-primary-light rounded w-24"></div>
                </div>

                <div className="pt-3 mt-3 border-t border-primary-light">
                  <div className="h-3 bg-primary-light rounded w-40"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkeletonLoader
