import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CandidateSkillService, SkillRequest } from '../../../../core/services/candidate/candidate-skill.service';
import { Skill, SkillLevel } from '../../../../core/models/candidate.modele';
import { finalize } from 'rxjs';

interface SkillCategoryStat { category: string; count: number; color: string; }
interface DetectedSkillRow { name: string; level: SkillLevel; selected: boolean; }

@Component({
  selector: 'app-skills-matrix',
  standalone: false,
  templateUrl: './skills-matrix.component.html',
  styleUrls: ['./skills-matrix.component.scss']
})
export class SkillsMatrixComponent implements OnInit {
  skills: Skill[] = [];
  filteredSkills: Skill[] = [];
  searchTerm = '';
  selectedCategory = 'Toutes les catégories';
  categories: string[] = ['Toutes les catégories'];

  loading = false;
  error: string | null = null;

  showSkillModal = false;
  editingSkill: Skill | null = null;
  formSkillName = '';
  formLevel: SkillLevel = 'DEBUTANT';

  showImportModal = false;
  importing = false;
  selectedFile: File | null = null;
  detectedSkills: DetectedSkillRow[] = [];

  levels: SkillLevel[] = ['DEBUTANT', 'INTERMEDIAIRE', 'EXPERT'];
  categoryColors: Record<string, string> = {
    Backend: '#3b82f6', Frontend: '#22c55e', Database: '#f59e0b', DevOps: '#a855f7', Outils: '#6b7280', Autre: '#94a3b8'
  };

  private categoryMap: Record<string, string> = {
    java: 'Backend', spring: 'Backend', 'spring boot': 'Backend', node: 'Backend', 'node.js': 'Backend',
    'c#': 'Backend', python: 'Backend', php: 'Backend', '.net': 'Backend', laravel: 'Backend',
    angular: 'Frontend', react: 'Frontend', vue: 'Frontend', javascript: 'Frontend',
    typescript: 'Frontend', html: 'Frontend', css: 'Frontend', sass: 'Frontend',
    sql: 'Database', postgresql: 'Database', postgres: 'Database', mysql: 'Database',
    mongodb: 'Database', oracle: 'Database', redis: 'Database',
    docker: 'DevOps', kubernetes: 'DevOps', jenkins: 'DevOps', ci: 'DevOps', 'ci/cd': 'DevOps',
    aws: 'DevOps', azure: 'DevOps', gcp: 'DevOps', terraform: 'DevOps',
    git: 'Outils', jira: 'Outils', figma: 'Outils', postman: 'Outils'
  };

  constructor(private skillService: CandidateSkillService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.loadSkills(); }

  loadSkills(): void {
    this.loading = true;
    this.skillService.getMySkills().subscribe({
      next: (skills) => {
        this.skills = skills;
        this.buildCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.error = 'Impossible de charger les compétences.'; this.loading = false; }
    });
  }

  categoryFor(skillName: string): string {
    const key = (skillName || '').trim().toLowerCase();
    return this.categoryMap[key] || 'Autre';
  }

  buildCategories(): void {
    const set = new Set(this.skills.map(s => this.categoryFor(s.skillName)));
    this.categories = ['Toutes les catégories', ...Array.from(set)];
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredSkills = this.skills.filter(s => {
      const matchesTerm = !term || s.skillName.toLowerCase().includes(term);
      const matchesCategory = this.selectedCategory === 'Toutes les catégories'
        || this.categoryFor(s.skillName) === this.selectedCategory;
      return matchesTerm && matchesCategory;
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  onCategoryChange(): void { this.applyFilters(); }

  starsFor(level: SkillLevel): number {
    switch (level) {
      case 'EXPERT': return 5;
      case 'INTERMEDIAIRE': return 3;
      default: return 2;
    }
  }

  starsArray(level: SkillLevel): boolean[] {
    const filled = this.starsFor(level);
    return Array.from({ length: 5 }, (_, i) => i < filled);
  }

  levelLabel(level: SkillLevel): string {
    switch (level) {
      case 'EXPERT': return 'Expert';
      case 'INTERMEDIAIRE': return 'Intermédiaire';
      default: return 'Débutant';
    }
  }

  colorFor(category?: string): string {
    return this.categoryColors[category || ''] || '#94a3b8';
  }

  
  openAddModal(): void {
    this.editingSkill = null;
    this.formSkillName = '';
    this.formLevel = 'DEBUTANT';
    this.showSkillModal = true;
  }

  openEditModal(skill: Skill): void {
    this.editingSkill = skill;
    this.formSkillName = skill.skillName;
    this.formLevel = skill.level;
    this.showSkillModal = true;
  }

  closeSkillModal(): void { this.showSkillModal = false; }

  saveSkill(): void {
    if (!this.formSkillName.trim()) return;
    const payload: SkillRequest = {
      skillName: this.formSkillName.trim(),
      level: this.formLevel
    };

    const obs = this.editingSkill?.id
      ? this.skillService.updateSkill(this.editingSkill.id, payload)
      : this.skillService.addSkill(payload);

    obs.subscribe({
      next: () => { this.closeSkillModal(); this.loadSkills(); },
      error: () => { this.error = "Erreur lors de l'enregistrement de la compétence."; }
    });
  }

  deleteSkill(skill: Skill): void {
    if (!skill.id) return;
    if (!confirm(`Supprimer la compétence "${skill.skillName}" ?`)) return;
    this.skillService.deleteSkill(skill.id).subscribe({
      next: () => this.loadSkills(),
      error: () => { this.error = 'Erreur lors de la suppression.'; }
    });
  }


  openImportModal(): void {
    this.selectedFile = null;
    this.detectedSkills = [];
    this.showImportModal = true;
  }

  closeImportModal(): void { this.showImportModal = false; }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }
 analyzeCv(): void {

    if (!this.selectedFile) return;

    this.importing = true;
    this.error = null;

    this.skillService.analyzeCv(this.selectedFile)
      .pipe(
        finalize(() => {
          this.importing = false;
          this.cdr.detectChanges(); 
        })
      )
      .subscribe({

        next: (res) => {
          console.log('CV ANALYSIS SUCCESS:', res);

          this.detectedSkills = (res.skills || []).map(s => ({
            name: s.name,
            level: (s.level?.toUpperCase() as SkillLevel) || 'DEBUTANT',
            selected: true
          }));

          console.log('DETECTED SKILLS:', this.detectedSkills);
          this.cdr.detectChanges(); 
        },

        error: (err) => {
          console.error('CV ANALYSIS ERROR:', err);
          this.error = "L'analyse a échoué. Veuillez réessayer.";
          this.cdr.detectChanges(); 
        }
      });
  }
 
  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.detectedSkills = [];
    } else if (file) {
      this.error = 'Seuls les fichiers PDF sont acceptés.';
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.detectedSkills = [];
  }
  confirmImport(): void {
    const skills = this.detectedSkills.filter(s => s.selected).map(s => ({ name: s.name, level: s.level }));
    this.skillService.confirmCvAnalysis({ skills }).subscribe({
      next: () => { this.closeImportModal(); this.loadSkills(); },
      error: () => { this.error = 'Erreur lors de la confirmation.'; }
    });
  }


  get totalSkills(): number { return this.skills.length; }
  get categoryCount(): number { return this.categories.length - 1; }
  get averageLevelPercent(): number {
    if (!this.skills.length) return 0;
    const sum = this.skills.reduce((acc, s) => acc + this.starsFor(s.level), 0);
    return Math.round((sum / (this.skills.length * 5)) * 100);
  }
  get categoryStats(): SkillCategoryStat[] {
    const map = new Map<string, number>();
    this.skills.forEach(s => {
      const c = this.categoryFor(s.skillName);
      map.set(c, (map.get(c) || 0) + 1);
    });
    return Array.from(map.entries()).map(([category, count]) => ({ category, count, color: this.colorFor(category) }));
  }
  get donutGradient(): string {
    const stats = this.categoryStats;
    const total = this.skills.length || 1;
    let acc = 0;
    const stops: string[] = [];
    stats.forEach(s => {
      const start = (acc / total) * 100;
      acc += s.count;
      const end = (acc / total) * 100;
      stops.push(`${s.color} ${start}% ${end}%`);
    });
    return `conic-gradient(${stops.join(', ')})`;
  }
}
