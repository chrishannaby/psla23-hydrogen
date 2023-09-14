function StarIcon({className}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.868 2.8837C10.5469 2.11168 9.45329 2.11168 9.13219 2.8837L7.3014 7.28547L2.54932 7.66644C1.71586 7.73326 1.37791 8.77337 2.01291 9.31732L5.63349 12.4187L4.52735 17.056C4.33334 17.8693 5.21812 18.5121 5.93167 18.0763L10.0001 15.5913L14.0686 18.0763C14.7821 18.5121 15.6669 17.8693 15.4729 17.056L14.3667 12.4187L17.9873 9.31732C18.6223 8.77337 18.2844 7.73326 17.4509 7.66644L12.6988 7.28547L10.868 2.8837Z"
        fill="currentColor"
      />
    </svg>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function ReviewsPlaceholder() {
  return (
    <div>
      <h2>Recent reviews</h2>
      <div className="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
        <p className="animate-pulse pt-10">Loading</p>
      </div>
    </div>
  );
}

export function Reviews({reviews}) {
  return (
    <div>
      <h2>Recent reviews</h2>
      <div className="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
          >
            <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
              <div className="flex items-center xl:col-span-1">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        review.rating > rating
                          ? 'text-yellow-400'
                          : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  {review.rating}
                  <span className="sr-only"> out of 5 stars</span>
                </p>
              </div>

              <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                <h3 className="text-sm font-medium text-gray-900">
                  {review.title}
                </h3>

                <div
                  className="mt-3 space-y-6 text-sm text-gray-500"
                  dangerouslySetInnerHTML={{__html: review.content}}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
              <p className="font-medium text-gray-900">{review.author}</p>
              <time
                dateTime={review.datetime}
                className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
              >
                {review.date}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
