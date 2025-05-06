"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CreateSubjectNameModal } from "./modalSubjectName"
import { CreateSubjectModal } from "./modalCreateSubject"
import { Materia } from "@/lib/model"
import { SubjectCard } from "./subjectCard"
import { useTheme } from 'next-themes';
import { ThemeToggle } from "./ThemeToggle"
import { ResultsModal } from "./resultsModal"
import { Horario } from "@/lib/model"

export const TimeTableCalculator = () => {
    
    const { theme, setTheme } = useTheme();
    const [subjects, setSubjects] = useState([])
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [results, setResults] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentSubject, setCurrentSubject] = useState(null)
    const [newSubjectName, setNewSubjectName] = useState("")
    const [isCreateNameModalOpen, setIsCreateNameModalOpen] = useState(false)
    const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] = useState(false)
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)

    const handleCreateSubject = () => {
        setCurrentSubject(null)
        setIsCreateNameModalOpen(true)
    }
    const handleContinueCreation = (name) => {
        setNewSubjectName(name)
        setIsCreateNameModalOpen(false)
        setIsCreateSubjectModalOpen(true)
    }

    const handleSubjectCreation = (subjectName, commissions, isUpdate = false, onClose) => {
        const nuevaMateria = new Materia(subjectName, commissions);

        // 2. Leer el listado existente de localStorage
        const raw = localStorage.getItem("subjects.json");
        let lista = raw ? JSON.parse(raw) : [];

        if (isUpdate) {
            // 3a. En modo edición, reemplazamos la materia con mismo nombre
            lista = lista.map(m =>
                m.nombre === subjectName
                    ? nuevaMateria
                    : m
            );
        } else {
            // 3b. En modo creación, agregamos al final
            lista.push(nuevaMateria);
        }

        // 4. Guardar de nuevo
        localStorage.setItem("subjects.json", JSON.stringify(lista));

        // 5. Cerrar el modal
        // Si estás usando React, probablemente pases `onClose` como prop
        if (typeof onClose === "function") {
            onClose();
        }

        setSubjects((prev) => {
            const updatedSubjects = [...prev, nuevaMateria]
            saveSubjectsToStorage(updatedSubjects)
            return updatedSubjects
        })
    }
    useEffect(() => {
        loadSubjectsFromStorage();
    }, []);

    const loadSubjectsFromStorage = () => {
        const storedSubjects = localStorage.getItem("subjects.json");
        if (storedSubjects) {
            try {
                const parsedSubjects = JSON.parse(storedSubjects);
                const waitingSubjects = [];
                const selected = [];

                parsedSubjects.forEach((subject) => {
                    if (subject.isWaiting) {
                        waitingSubjects.push(subject);
                    } else {
                        selected.push(subject);
                    }
                });

                setSubjects(waitingSubjects);
                setSelectedSubjects(selected);

            } catch (error) {
                console.error("Error parsing subjects from localStorage:", error);
            }
        }
    };

    const handleSelectSubject = (subject) => {
        subject.isWaiting = false

        setSubjects((prev) => {
            const updatedSubjects = prev.filter((s) => s.nombre !== subject.nombre)
            return updatedSubjects
        })

        setSelectedSubjects((prev) => {
            const updatedSelected = [...prev, subject]
            saveSubjectsToStorage([...subjects.filter((s) => s.nombre !== subject.nombre), ...updatedSelected])
            return updatedSelected
        })
    }

    const handleUnselectSubject = (subject) => {
        subject.isWaiting = true

        setSelectedSubjects((prev) => {
            const updatedSelected = prev.filter((s) => s.nombre !== subject.nombre)
            return updatedSelected
        })

        setSubjects((prev) => {
            const updatedSubjects = [...prev, subject]
            saveSubjectsToStorage([...updatedSubjects, ...selectedSubjects.filter((s) => s.nombre !== subject.nombre)])
            return updatedSubjects
        })
    }

    const handleEditSubject = (subject) => {
        setCurrentSubject(subject)
        setNewSubjectName(subject.nombre)
        setIsCreateSubjectModalOpen(true)
    }
    const saveSubjectsToStorage = (allSubjects) => {
        localStorage.setItem("subjects.json", JSON.stringify(allSubjects))
    }

    const handleDeleteSubject = async (subjectName) => {
        const nextWaiting = subjects.filter(s => s.nombre !== subjectName);
        const nextSelected = selectedSubjects.filter(s => s.nombre !== subjectName);

        setSubjects(nextWaiting);
        setSelectedSubjects(nextSelected);

        saveSubjectsToStorage([...nextWaiting, ...nextSelected]);
    }

    const handleUpdateSubject = (subjectName, commissions) => {
        const all = [...subjects, ...selectedSubjects];

        // 2) Actualizo la comisión correspondiente
        const updated = all.map((s) =>
            s.nombre === subjectName
                ? { ...s, comisiones: commissions }
                : s
        );

        // 3) Separo de nuevo en waiting / selected
        const waiting = updated.filter((s) => s.isWaiting);
        const selected = updated.filter((s) => !s.isWaiting);

        // 4) Actualizo estado y storage
        setSubjects(waiting);
        setSelectedSubjects(selected);
        saveSubjectsToStorage(updated);

        // 5) Cierro el modal de edición
        setIsCreateSubjectModalOpen(false);
    }
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1)
        }
    }
    const handleCalculate = () => {
        if (selectedSubjects.length === 0) {
            alert("Seleccione al menos una materia para calcular")
            return
        }

        const compatibleSchedules = Horario.calculateHorariosCompatibles(selectedSubjects)
        setResults(compatibleSchedules)
        setCurrentPage(0)
        setTotalPages(Math.ceil(compatibleSchedules.length / 4))
        setIsResultsModalOpen(true)
    }
    
    return (
        <div className="container mx-auto px-4 py-6 bg-card">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl text-primary font-bold">Time Table Calculator</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href="https://ignacio-code-portfolio.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            About Me <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </header>

            <div className="bg-card rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <Button onClick={handleCreateSubject}>Crear Materia</Button>
                    <Button onClick={handleCalculate}>Calcular</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Materias Disponibles</h2>
                        <div className="space-y-4">
                            {subjects.map((subject) => (
                                <SubjectCard
                                    key={subject.nombre}
                                    subject={subject}
                                    onSelect={() => handleSelectSubject(subject)}
                                    onEdit={() => handleEditSubject(subject)}
                                    onDelete={() => handleDeleteSubject(subject.nombre)}
                                    isSelected={false}
                                />
                            ))}
                            {subjects.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">
                                    No hay materias disponibles. Crea una nueva materia.
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Materias Seleccionadas</h2>
                        <div className="space-y-4">
                            {selectedSubjects.map((subject) => (
                                <SubjectCard
                                    key={subject.nombre}
                                    subject={subject}
                                    onSelect={() => handleUnselectSubject(subject)}
                                    onEdit={() => handleEditSubject(subject)}
                                    onDelete={() => handleDeleteSubject(subject.nombre)}
                                    isSelected={true}
                                />
                            ))}
                            {selectedSubjects.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">
                                    No hay materias seleccionadas. Selecciona materias para calcular.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CreateSubjectNameModal
                isOpen={isCreateNameModalOpen}
                onClose={() => setIsCreateNameModalOpen(false)}
                onContinue={handleContinueCreation}

            />
            <CreateSubjectModal
                isOpen={isCreateSubjectModalOpen}
                onClose={() => setIsCreateSubjectModalOpen(false)}
                onCreateSubject={(commissions) => handleSubjectCreation(newSubjectName, commissions, false, () => setIsCreateSubjectModalOpen(false))}
                onUpdateSubject={handleUpdateSubject}
                initialSubject={currentSubject}
            />
            <ResultsModal
                isOpen={isResultsModalOpen}
                onClose={() => setIsResultsModalOpen(false)}
                results={results}
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
            />
        </div>
    )
}
