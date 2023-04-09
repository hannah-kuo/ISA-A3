import React from 'react';

function Pagination({ numPages, currentPage, setCurrentPage }) {

    const pageNumbers = [];

    for (let i = 1; i <= numPages; i++) {
        pageNumbers.push(i);
    };

    const nextPage = () => {
        if (currentPage !== numPages) {
            setCurrentPage(currentPage + 1);
        };
    };

    const prevPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        };
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <br/>
            {(currentPage !== 1) && (<button onClick={prevPage}>prev </button>)}

            {
                pageNumbers.map(number => {
                    if (number < currentPage + 5 && number > currentPage - 1) {
                        return(
                        <>
                         <button onClick={() => setCurrentPage(number)} style= {{backgroundColor: (number == currentPage) ? 'red' : ''}}>
                        {number}
                        </button>
                        </>)
                    }
                })
            }

            {
                (currentPage !== numPages) && <button onClick={nextPage}> next </button>
            }
        </div>
    );
};

export default Pagination;