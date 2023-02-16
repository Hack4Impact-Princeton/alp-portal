import TeamMember from '../components/TeamMember'
import Grid from '@mui/material/Unstable_Grid2';

function TeamPage () {
    return(
        <div className='teampage'>
            <h1>The Hack4Impact Team</h1>
            <h2>Spring 2023</h2>
            <h2>Fall 2022</h2>
            <Grid container spacing={3}>
                <Grid xs={3}>
                    <TeamMember
                        name="Ivy Wang"
                        role="Tech Lead"
                        year="2023"
                        imgsrc="https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug"
                    ></TeamMember>
                </Grid>
                <Grid xs={3}>
                    <TeamMember
                        name="Suhani Balachandran"
                        role="Tech Lead"
                        year="2023"
                        imgsrc="https://whitmancollege.princeton.edu/sites/g/files/toruqf1576/files/styles/3x4_750w_1000h/public/people/picture_-_suhani_balachandran.jpg?itok=ZcVhhuTv">
                    </TeamMember>
                </Grid>
                <Grid xs={3}>
                    <TeamMember
                        name="Derek Geng"
                        role="Tech Lead"
                        year="2023"
                        imgsrc="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFhYYGRgaGRgZGBgYGBgYGBoaGBgZGRgYGBgcIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzQrISs0NDQ0NDY0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAOAA4QMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAIFBgEAB//EADsQAAEDAgQEAwcBBgYDAAAAAAEAAhEDIQQSMUEFUWGBInGRBhOhscHR8DIUQlJy4fEVI2KCorKSwuL/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAAkEQADAQADAQEAAgEFAAAAAAAAAQIRAyExEkEEUSIUMlJxgf/aAAwDAQACEQMRAD8A+l4Qp8JGmITTXLCfCyRXsyi5yiXJ6GE/eKLnqC4SkGHXPUcyg4r0oGdJXA9L1sS0bqnx/G2t3S00jiqn0XVbFBupVHxDjjW7rNY7jb3mGSgUOF1Khl03Ut74da4o41tsZxPGXvMMlcocNe8y6Ve8M4C1kSFoKOGa0WCan+zO/wCS/IWIoMBwMDZX+GwrW7I7WKSpLDldOu2dkLK+0fEnPJpsMNH6nA69LbKy45xD3bCB+p1h9T2+qyTKs215rK6/DSJb7L32Sxbg51JxkEZmyZIO49L9lqW1FgcC/LXpub/EBrrNiI8itynxPULlWUHc9Ce5SauPC0Mga9CkGqLkAdhchcDkCviA3dBSlvwbDgh1cU1upWfx/HWsBusrjvaF7zlZdJ0kdfH/ABKfddI+gf4kzmvL5l7/ABHNdU/bNf8AS8f/ACPrbWo0rhXCrPNw44qBKKAuOCBkWuUXOUKtdrd1R8R44xu6W4axxVb6RcVcSG6qmx/Gms3WXx3G3vMMBQsJwypUMvlS63w61xRxraYfGcZe8wyUPDcLfUMulaPAcCa0XCu6GFa3QIS30yr+S8yViKHA8Aa2LK9w+Fa3ZMQptCtLDlqm/SIaF0KWVcKCSUpXF4jLYfqOijiMUG73VNj8SQ1z9XuljelvE70t3WVX+I1mP1lLxrGZ6hAMtZYHnzPcylhUaBe/Tn6r1NmWwt3B7qFWTvfnf5KF2aphcLXirTJBEPbaIAuvomVfLrtIOae0fdfTcHVD2MeLhzQfgtOPrURzfjCsauuUpQK9YDUrUxSb8C5kCpXaNSqrHcYawG6yPE/aMkwySpdJHZxfxW+34ariPGWsGqyHEvaFzzDJKToYOrXMumFpeGezQFyFH+VGzvi4ep7ZmcNw6pVMulaThvs4BBIWnwvDWtiysmUFSlI5eX+RV+sz/wDg45Ly0Pu15Uc+hyLIcoVfFBupVFxHj7GA3QzXj4bp9F4/ENbuqXiXHWsBuFksf7RPeYYD5pTD8Nq1TLyVDr+jrXDHH3b/APDR4rjLPdZ3SSSWtAsXGJ1WbfXpvMuY8f7w74ZU17Q4I0qdIRaX+vhVTTeN1jVNPsUttNy8RqODtwxsHgHk6Ae2y12GwrALQvlxcI0Ks+Gcbq0YE5mbtP0vZXN56jG+Pe0z6QGLpYqLAe0LKv6T4t2Osex0KfHEho4ELT7Rj8UOtC9IVY/ijR9EpV4gXTB6yprllDXE36Xr6rRukcRxAXAWcxHEjzP9jsh0seHTN7SOaxrn3pGs8Wdsbq4oB2ZxMbJbG4oFgvBM26TKr34+5bEz+WStZ866XPksPqu8NvlfopUrPDraLh4g8Wgnt057JxovECyg6m1wgjXfzVTeek1Ith673uh2aDvNh6L6D7MVMuGYHatL2ns8rFUsM0NOSM2pJtA6K4wuOcaRay5E953W82lWkufrp+F9xDjLWDUBY/iftNJIZc9ErW4VXqHxk32+6tuG+zGWJC02q8Nvrh4V12ygpYStXMukBaThnswBBIWnwPDmsGisWtAVqUjm5f5NX/0VuE4Y1gsE+xgCnnCkqw5tOsCMEEFSLkATleQpXkAfLuJ+0r3ktZJSuD4ZVrGXk+S0nC/ZfLBIWjw/DgzRQpb9O6/5XXzCxFLw72ea0CQtBh8Cxo0CmKRC6WFNLDjqm/Sm9reH58OS3Vhzx0iD9+y+ch4Gy+we6MXXzL2n4ccNV3yOlzD03b5j7LPkntM34a6cle6oCYAJPJepvvBDSeQvHOTokQ4vsPCzeLF3mdeyaY8NEDe0Dol89F0wpxDWu8OYdQYHotFgOMNLCHSI31I5EcxzCx735vC2IOp5x1T2HYWgeLTbdZU8Kmfo0Ixhe6S6BtslavEMrx4uYIi5VU/EyJaDAcJHLnHT83uWnkD2vcZG3cRr3HoscZosLGuzw9Tdo87r2EcYBLQQTAP82ko9RufxMILmHuY/Aqo4ktLgJLSJ8na2+B7oc4JPUXWIwjIkjKefx+qr35HSBY3t5f2ReJYiaGcH+GI/1Rfyup4miDSa9gGYNk89CD8iqc74SnnoOnTjrrfb8uoCnv5lC4PiveBrTvE+QMwrcU5dGw/O6Xzq0KrHhXNok3NtI+qsOGtyEfMI76DcthJH5A+67hHAWgdk8xi+tRpsIGuANpT3ugs3Qq5TINlosJiA8Lr463o5rk8W8kninuAVqxi7UwwK0ZizKO4g4HQpxvEDCsqnDQdlwcNHJJJhgphsWXbJzM5HoYANTQpBNJjK+XLysMg5LyeAeDGhcLQh03leeVWAceRyUGOHJReVyQpDA5qBZb254c+thzkEvYcwbzb+8AecX7K7q1bWSYxBm6zqlmGsS09PjdKochgwBrbVBfirhrQZ0tM+VtFpvanhgpYkuaAGVP1DQBx3A5Ss9hqJZVtYeqia/s3a3tDmGYWNBJJn+Jpt5WXXVSb/AH+ClUfmdrA6XRqTRycecEf9SCsL7Zc9ILhDeTvbSb8jzHRRxT2+GLAEW5GZI+o5olF7CYMtIiCCCDGh0VfxrCPb4rQd22HYJKeh72Wz3Gh/nMl1N36xu07EevwSOOqgOL2xkcM3KARMg8gZ8pVnwjFNdQDXXkQ5uoPOPX5Kvfh8oyjx0wCB0Ek/KQqckqu+wtLFZqJZMgGJ3vf4GVecKf8A5Qa6JAg9dpHT7rM4VgaXsItqOkaRz5R5J5+JLdbSItoTv+dULp6Klqwl7r3WIbH6HOAH2+ausViqdKXveAHaTyWe4liIYaj9GX6k6QPMlZzGUXmpRfiHZjWBLWgghggGmCNi7xW6BXEamZ3Xmm0b7W4d3ha6dt5vsoniL32pA9TEDsspiMM1jqb2ME5g0jTMCDr5ayvoVRoYxr4AkafJTc6tT6KmkvzsrsFjHtnODAsCbSd45haz2e4g1xEaG3dZd2JD8zYiNHHn0XeEvcyoIMiRKUV8sKWp6fT2vCk16Sw75R867TkGIXiIQW1QvPqoDDz6qh75Cc5QJQGDPvF5K515IAoK5PNeBhKYmvsEqrEVMtkq+IASwqkmdkq53MrxqLB26OhQkg76ylRozcodIBN4bn6KlP8AYqeGa9s8IHho3CwGIwgaZlxOmuq+kceZmIvzlY/HMBPhiB81lXT6Lh9YyqoUzG56GxCcostfWLbkjt80R9Mhul9kr+2Bs5o67fRSvSn4MPwYJva+9j35qYwwDSw+JpnpHlv6/BUfEuOF3gptlzjDZ0HM6aWVdjMFUDW1KlVwa57WAB0EuOpaJmANT2W08emVXnppMFh3slkyDdp/NEYvIMG19BbX+3xWbdi6mFIcHl7JhzXGT5tdqtWyszEUs7DtPURqCj461Aq1gXUdCIseiLVoZgDvbbVEwtIkdoTeEYCIO34FnhelL7aUCMCHN2e2fKfvCzmE4pRcwB5AIjXmLgrd8UptdRex12m8axB39FQ8A4HQlzny68xNiBsRMLT6lz8v0hRX+5C3CaVTE1mZGRRpyXOduSNj5FaHjfE2nwsMgWB2kWso4/iLcnu2DKwaNbb4clR1jmsGknck/TqsqpeI0mc7ZZcPzPMTAt3V7gKYmJsD6+aocO33cOeZd+61qt8Di/EBzI857Jwkn2Rbb8PoNB4DR5KL6t0BjvCPJcvK7NObBprypiUux6Za8IERuuOKlnUSkB5eXZXEAexbwDAKqMZXIRsZU9VX16hgrlutZ1xOISxHECNNeSbwOZ4l1gq2lSD3XV04gNDQphN9sungWlS8UA2TuhAQMLYEk7Jd+JcSDtK3RixXjLoHqsXXzZu62XGfFTnrdYzGEtM7dysrXZcMV4tjSPC389EhRwJf4nuN9tAPhZdcC6oD85A/qmcWw2c3uIU4Xv4KcS4QRlqMmWA6HW17KtfiKbwMxymxyusZFwRzVuziLmWmx9PkovfSeczqTSeYMfJaK/7IcGZ4vjQ+GN8UHUfIK29lsW6i/I4ENcCHdHbSrehWw7D4KLWk72m2pJKFxUh3iaI39FT5Ep+UKePvWX9LFAHz/PzyTtGoJkbjp5+ZWOp4pzcvLWfPQeavMHiwQD+d1kmaORriQiTrm2SHDGnkb6iPUGEbFY9gYS7SN/mOSDwLEhxOR2YalzSNSTboYUOHujmkpGMThGg5ojX7KvpYYl+k8ifstLQr5nkFofoMoFx1MlNN4cR4oY2Z8IIkDnOnoqmG2RXJiM66gRoJ/wBRsPU2TnCcKPeNl03H6RA/8jf4IWJIzSSyebnvcf8AgFf+zGFDn5vCQOQf/wCy2U94YfTw1NNlgvPCK8gLgeCtzLQTWqQXihmqEDJuK9KHmldKQBJ6ryBJXkDAVRJlVPEneEibq2xlYNVDxOv4SSFyUujpli/DaLs2qtqTCX30CpuDVCSSFoKJgTzRHhVejrC0N6lVfEK7RvHwXsZxHIbX7KlqufUMnN8gtfr8MsLClVD6b2i+43KxmNc8ujTsFqMLUc1wAiN7bdSkONUWsdmAsbz/AFSqdWjmseGeqNc0TKK2k5wBmPkmX1GOGwQHVQBAMdVPyPdF6+Def1RHMa/JKuw51AdA/ekj4KyY/wD1k+UJilgg+8k+eyfxvgfeelNSpEuGvPl81ZDC5/zTRN1MI1gvv+aKYol4bDHxN/3R/um6lwy1afYjicKMoAGaNPsqb9u93LXBzRt4ST2i0LSCmWkhzwT0FgOSdbTDhdkjm63dOZB3hgeJPDhmDi4xmAcTF9453Wz4LwxtDDtB8T3+J8G8kC0dFWY7g9IVWPDiWZrs0A3gHlIFuquzjDIOg2GvzWmdYyKrX0HpF7Tq2kDPIvJ5mQjUMVTBM1C6OgcO5JVUcRezRN7kyTKca9wZIDXc8oAIH8pBaR2nySSwzpnqbi91qYIJs4BgHqGH5rZcPYGMAAAO9gs5wGiwvDhY7ZZA7tMx2PZaggjVax32RRJ9SeXyXPeQooTiqJDF5KG1l15pXUAO0IGq7UcNkn7xQLyEgwckLyV94V5AytqPzu1S2LwucXKhRqjMSo4ziAAXHqa7Or96C4DCtZ4W7p2veBMJfh2La8S0abouMfBbAVzmCe6SfhxB581VYkZP3ifkn6le/ZZnjdR0309FVPF0SlrwjiceZgGB01P9E5QIq0y12u3P4rL/ALUM2ybw2PhwIk+dgnL30VLPAeKwuRxGyGzCNJkmfNXZLammv7yUqUQ3SZ6a/wDz80YGgWYYDQAH4+fTvCawzwDYlx6ffU9vVKkEiD4W/PyG6YoXGkN5cwN3H+H+w5i5aIpFmx4iQ0E9Of1Pqg4h7jd78rTo1uvnMT6IPvZs099B/RouiB4EGxMWnlElx7bf1VNaSnh5jw1sNER+8/ftug18VMkutG9h1gIVfMTJNzHawJj1Q2YCTLnW5HuVOMrULYkueIaDl6b6wiU8A6Ccxtte3SVYsa0AckDEYkfnwTeJBovh8PkuSTfcpmlWIdmBSTnkjVcY8hY1RSnTTcOry8ObY7t07gfnynXMdaVg+CPl4W6aZC04nusi1jw85wKC8KTW3RXhakAGMR2MXKTLpw0wkAm6mitpAI5phCegZy3NeUYPJeQBhcdiskwqdlepVeGsbablaXH4EGUXhODYwdVwpNvDs1JaO4OgKbAErj62kGL905xJ8QN1WPYcwlaP+jPf0mHFvMzuVS8admkkq1x7jEyqWswuJvPnZDf4Er9MvUYc1jZN0wWiXGB6E9ETENDHWufgPv39EpWa59501cdB9vIKl0N9lpRx0Rk8I+J/PXrsn21BEusf4fv9lQYaqGmG67uOv+0bD4qxw97nQfE8vutE0zJrCwDZgm5Og28z06KFcyCAZvc8yPoNkOSJJNzb+3kPyyGx7hfrDfPn5DXzhNoWjTKWW2+87nWD0Gp6qLpOZ3Pwjub/ACPqUu/EOAt5D797+qjTe8i/8TfqgQfFPgk8reiSfinGwUjTcSZM3PxKnTwqTAXbUfpmN9fh9l5lAnU3ViygFI0VLTY0xKo2AlWG+qcxAOhSYZDllRrJpeAM8QW1YVkPZ5p1WkZVK24VkmPI/wDIsGBcclmVSpMdJutSBxgClmQHDLouGogYT3vMonvAkIzFTfYIAb941eVd71eQBV1H+Ihe4eyXm9ghtpkSSuYSqWzO65fGdH4GxdSXoFV4Km1hkk6JXDgueSRYaXR+gdruBbA15rL4uq5riAdfVaXH1QOSzPFCTMadN/NDCRR7m6kz0Gvc7IYv5bAaBKsdlkbr3v4sUFYEyeK3rsBufIJ7D1tCNNGjf+Y9fzZKMMt5ZvXKNT3I/wCPVSo1Jd4dB9NlSeEtaWwMkNG1vM7/ABRsoPYQPqe9/UKtwlTKXHkPibD5z2TPvSAO5P0WipGbkIWSi0majyP56qNF8orDf87ITE0FNG581JrAuGpuo1q8XV9E4TLUKtpZCdWM9FA1N5WdMpIXe/mosEkbqVR4cU9wvCy4ALF9s1XSNLwHDQy6tHtA0QcNTMQp16eXquqZxYc7evT2cyvPcbIbK4CK103RgEX1SisdISrpLoR2CLJsCdFxC6982XW1MoSoq+JAg2Qry7nXkAV+KMugILKEvaNt0GrXIJi5RaD3ZgSuZtM6FoxjTeAkq/hAEm/Jcx2LyEk3KSqOe9odMJthhHiLrQAqGpWk5fkrLGE6TZVGIYBdSWl0IYmneyTyyY3JAHmrHPa6EGC7tIBjzNvrKEPRfEviQNLAfyjTvujYOoAEvVEdUMNNoQBdsIyzzd/1FvmVNhknoq1mIiByaPjf6o7MTCrSPllowo7RaJVazE2RGVHOQmJoshWsJ3kHzQazhOtlDJzOv5KE+kTaU3TEpQOpXgwoNBcbqb6UEFFkBQ9Y+kSyNFt1ovZihL/ILOMuVs/ZNkEmESv8hU+i5dQcLoNVjjqrR7JS76R2XUYle+kIUKJhNPoO5KHuSgDlI30U6jgSu+6IUALoA69qA1t0w4c1GoyNEATtyC8l4PJeQBRsYXHTRMA6dEzgy0B0brjmANlcsydDZnuMZi4RoujGQACekI/FTDVROM6I8Gu0MY+oSLaKrLud1YUjIIJnrskaxAMIwYtUZPmhOB0637f3RXPUi1ACVTdTpEaJtlKbIT8IJCYacyiTb8FkWlTHxXm4c7FFYwxdAmzr6IAsu0yR8l7ZSDUE6Ga+QJXW1ee2iXqHZdaRugAz3yht6rj3AiyI1qTAJhdVuPZ4ZW+axmDpyVrcG/LAVR6TRrmCUR1MAJDC4iwTjqocF0GOECAVx7BsotldpvugZw01z9mi6O54QKmIMJgBqwUu8IzZKi+mQkBDK1eUci8gCjouiQvVK3hPRebTOiBXp2LVzdnQVTX+9cQ42CQxWCI0NkYgMJ3UTis1jbkkV54Vz62UZR3QQ8bpjE0LpWph+SAIvc3ZeLgBO65TpmZ2CM6lKrCWxUS2/NTa6bHdTdThDa8F3kngtDYZsTewUw+/RAa8CV5vjbMpgMOqBdYYF0uWX12HqpVhftHqpA6HypuEoGH67JofxIA8xsfRFa9KPqTCYpMlJgWXDwSVcsqHMFW4QQJTFGp4kLwRteF+Jt07SYAq3gz/AAq0IjVdK8MWeqCbBQ9yW7o2cBQe6UxAXLzGCF4hRY26ADNbAQ31gbIrjCVDZKQyVl1c92V1AH//2Q=="
                    ></TeamMember>
                </Grid>
                <Grid xs={3}>
                    <TeamMember
                        name="Emilio Chan"
                        role="Tech Lead"
                        year="2023"
                        imgsrc="emilio_chan.JPG">
                    </TeamMember>
                </Grid>
                <Grid xs={3}>
                    <TeamMember
                        name="Willow Yang"
                        role="Tech Lead"
                        year="2023"
                        imgsrc="IMG_3139.JPG">
                    </TeamMember>
                </Grid>
                
            </Grid>
        </div>
    )
}

export default TeamPage