import styled from "styled-components";

const LoaderOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6); /* Background semi-transparan */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Supaya tampil di atas semua elemen */
`;

const Spinner = styled.div`
    width: 60px;
    height: 60px;
    border: 6px solid #ffffff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

export default function Loader() {
    return (
        <LoaderOverlay>
            <Spinner />
        </LoaderOverlay>
    );
}
