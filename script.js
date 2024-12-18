 document.addEventListener('DOMContentLoaded', function () {
            const projectName = document.getElementById('projectName');
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fileInput');
            const fileListContainer = document.getElementById('fileListContainer');
            const fileList = document.getElementById('fileList');
            const scanButton = document.getElementById('scanButton');
            const errorMessage = document.getElementById('errorMessage');
            const previewTransmittal = document.getElementById('previewTransmittal');
            const previewProjectName = document.getElementById('previewProjectName');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const pageInfo = document.getElementById('pageInfo');
            const uploadQueue = document.getElementById('uploadQueue');
            const uploadQueueFileListContainer = document.getElementById('uploadQueueFileListContainer');
            const uploadQueueFileList = document.getElementById('uploadQueueFileList');
            const exportButton = document.getElementById('exportButton');
            const saveLibraryButton = document.getElementById('saveLibraryButton');
            const titleContainer = document.getElementById('titleContainer');

            let files = [];
            let isContainerAnimating = false;
            let currentPage = 1;
            let totalPages = 1;
           let initialFileListHTML = fileList.innerHTML;


            uploadArea.addEventListener('click', function () {
                fileInput.click();
            });


            fileInput.addEventListener('change', function () {
                const newFiles = Array.from(fileInput.files);
                if (files.length + newFiles.length > 20) {
                    errorMessage.textContent = "Maksimal 20 file yang dapat diunggah.";
                    return;
                }

                if (files.length === 0 && newFiles.length > 0 && !isContainerAnimating) {
                    isContainerAnimating = true;
                    fileListContainer.classList.add("show");
                    setTimeout(() => {
                        isContainerAnimating = false;
                        newFiles.forEach((file, index) => {
                            setTimeout(() => {
                                addListItem(file)
                            }, index * 150);
                        });
                    }, 400);
                } else {
                    newFiles.forEach(file => {
                        addListItem(file)
                    });
                }

                errorMessage.textContent = '';
            });
            function addListItem(file) {
                if (file.size > 20 * 1024 * 1024) {
                    errorMessage.textContent = `File ${file.name} melebihi 20MB!`;
                    return;
                }
                files.push(file);
                const li = document.createElement('li');
                li.innerHTML = `<span>${file.name}</span> <button type="button">Hapus</button>`;
                setTimeout(() => {
                    li.classList.add('show')
                }, 600);

                if (uploadQueue && uploadQueue.classList.contains('show')) {
                    uploadQueueFileList.appendChild(li);
                    fileListContainer.classList.add('show');
                    fileList.appendChild(li);
                } else if (uploadQueue && !uploadQueue.classList.contains('show')) {
                    fileList.appendChild(li);
                } 
                else {
                    fileList.appendChild(li);

                }

                li.querySelector('button').addEventListener('click', () => {
                    li.classList.add('remove');
                    setTimeout(() => {
                        files = files.filter(f => f !== file);
                        fileList.removeChild(li);
                        if (files.length === 0) {
                            fileListContainer.classList.remove("show");
                            fileInput.value = ''; // Reset the input value
                        }
                    }, 300);
                });
                fileList.appendChild(li);
            }


            let processedFiles = new Set();

            scanButton.addEventListener('click', function () {
                if (files.length === 0) {
                    errorMessage.textContent = 'Tidak ada file yang diunggah';
                    previewTransmittal.classList.remove('show');
                    return;
                }
                
                projectName.style.display = 'none';
                titleContainer.style.display = 'none';

                previewProjectName.value = projectName.value;

                previewTransmittal.classList.add('show');
                uploadQueue.classList.add('show');
                uploadQueueFileListContainer.classList.add('show');
                
                fileListContainer.classList.remove('show');

                const newFiles = files.filter(file => !processedFiles.has(file));

                newFiles.forEach((file, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${file.name}</span> <span class="status">Uploading...</span>`;
                    setTimeout(() => {
                        li.classList.add('show');
                    }, index * 100);

                    const statusSpan = li.querySelector('.status');

                    setTimeout(() => {
                        statusSpan.textContent = 'Scanning...';

                        setTimeout(() => {
                            statusSpan.textContent = 'Done';

                            if (index === newFiles.length - 1) {
                                updatePreviewTransmittal();
                            }
                        }, 1000);
                    }, 1000);

                    uploadQueueFileList.appendChild(li);

                    processedFiles.add(file);
                });
                fileList.innerHTML = '';
                updatePageInfo();

                function updatePreviewTransmittal() {
                    // Update the previewTransmittal content here
                }
            });

          function updatePageInfo(){
              totalPages = files.length;
             pageInfo.textContent = `${currentPage} / ${totalPages}`;
              if (currentPage === 1) {
                    prevBtn.disabled = true;
                } else {
                    prevBtn.disabled = false;
                }
                 if ( totalPages === 0) {
                   nextBtn.disabled = true;
                   previewTransmittal.classList.remove('show');
                  
                } else {
                   nextBtn.disabled = false;
                }
           }

           prevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    updatePageInfo();
                }
            });
            nextBtn.addEventListener('click', function() {
                 if (currentPage < totalPages) {
                   currentPage++;
                   updatePageInfo();
                }
           });
        });
